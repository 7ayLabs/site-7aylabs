#!/usr/bin/env bash
#
# db-backup.sh: verified online backup of the site SQLite databases.
#
# Installed on the host as /usr/local/sbin/site-db-backup by
# scripts/bootstrap-host.sh. It runs daily from the systemd timer
# `site-db-backup.timer`, and nightly from the "DB backup" workflow, which
# calls it through sudo and goes red if it exits non-zero.
#
# What it does, for production and staging in turn:
#   1. Takes a consistent snapshot with SQLite's online backup (`.backup`).
#      The databases run in WAL mode, so a plain `cp` of site.db can miss
#      committed pages that still live in the -wal file. The site keeps
#      serving while this runs.
#   2. Verifies the SNAPSHOT, not the source: PRAGMA integrity_check must
#      say `ok` and the file must contain at least one table.
#   3. Compresses it, checks the archive, and only then prunes archives of
#      the same target older than the retention window.
#
# A database that does not exist yet (the environment was never deployed)
# is skipped with a message. The run fails if any existing database could
# not be backed up, or if nothing at all was verified.
#
# Usage:
#   site-db-backup              # prod and staging
#   site-db-backup prod         # one target
#   site-db-backup staging
#
# Environment:
#   BACKUP_DIR              default /opt/7aylabs-site/backups
#   BACKUP_RETENTION_DAYS   default 14
#
# Must run as root: the Docker volume directories are root-only.
#
# Backups stay on this host. They protect against a bad deploy or a
# corrupted file, not against losing the VM. See docs/ops/runbook.md for
# the off-host options.
#
# Exit codes: 0 ok, 1 backup or verification failed, 2 usage or environment
# error.

set -euo pipefail
umask 077

BACKUP_DIR="${BACKUP_DIR:-/opt/7aylabs-site/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
DB_FILE="site.db"
LOCK_FILE="${BACKUP_LOCK_FILE:-/run/lock/site-db-backup.lock}"

log()  { echo "[db-backup] $*"; }
warn() { echo "[db-backup] WARNING: $*" >&2; }
err()  { echo "[db-backup] ERROR: $*" >&2; }

case "${1:-all}" in
  all)        TARGETS="prod staging" ;;
  prod)       TARGETS="prod" ;;
  staging)    TARGETS="staging" ;;
  -h|--help)  sed -n '3,40p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  *)          echo "usage: $(basename "$0") [prod|staging]" >&2; exit 2 ;;
esac

if [ "$(id -u)" -ne 0 ]; then
  echo "must run as root (the Docker volume directories are root-only)" >&2
  exit 2
fi
for bin in docker sqlite3 gzip flock; do
  command -v "$bin" >/dev/null 2>&1 || { echo "$bin not found" >&2; exit 2; }
done
case "$RETENTION_DAYS" in
  ''|*[!0-9]*) echo "BACKUP_RETENTION_DAYS must be a whole number" >&2; exit 2 ;;
esac

# One run at a time: the timer and the workflow may overlap.
exec 9>"$LOCK_FILE"
if ! flock -w 120 9; then
  err "another backup has been running for more than two minutes"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

VERIFIED=0
FAILED=0
WORK=""
cleanup() { [ -n "$WORK" ] && rm -f "$WORK" "$WORK-journal" "$WORK-wal" "$WORK-shm"; return 0; }
trap cleanup EXIT

backup_one() {
  local target="$1" volume container mount src stamp final check tables size pruned

  case "$target" in
    prod)    volume="site-7aylabs-db";         container="site-7aylabs" ;;
    staging) volume="site-7aylabs-staging-db"; container="site-7aylabs-staging" ;;
  esac

  mount="$(docker volume inspect --format '{{ .Mountpoint }}' "$volume" 2>/dev/null || true)"
  src="${mount:+$mount/$DB_FILE}"

  if [ -z "$mount" ] || [ ! -f "$src" ]; then
    if docker inspect "$container" >/dev/null 2>&1; then
      err "$target: container '$container' exists but $DB_FILE was not found in volume '$volume'"
      return 1
    fi
    log "$target: not deployed yet (no '$container' container and no database), skipping"
    return 0
  fi

  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  WORK="$BACKUP_DIR/.site-${target}-${stamp}.db.partial"
  final="$BACKUP_DIR/site-${target}-${stamp}.db"
  rm -f "$WORK"

  # 1. Online snapshot. `.timeout` makes the backup wait for a writer
  #    instead of failing on a busy database.
  log "$target: snapshotting $volume/$DB_FILE"
  if ! sqlite3 -batch -bail "$src" ".timeout 15000" ".backup '$WORK'"; then
    err "$target: sqlite3 .backup failed"
    return 1
  fi
  if [ ! -s "$WORK" ]; then
    err "$target: snapshot is empty"
    return 1
  fi

  # 2. Fold the snapshot into a single rollback-journal file so it can be
  #    opened anywhere (a WAL database needs a writable directory even for
  #    reads), then verify the snapshot itself.
  if ! sqlite3 -batch -bail "$WORK" "PRAGMA journal_mode=DELETE;" >/dev/null; then
    err "$target: could not normalise the snapshot"
    return 1
  fi
  check="$(sqlite3 -batch -bail "$WORK" "PRAGMA integrity_check;" 2>&1 || true)"
  if [ "$check" != "ok" ]; then
    err "$target: integrity_check did not return ok: $check"
    return 1
  fi
  tables="$(sqlite3 -batch -bail "$WORK" "SELECT count(*) FROM sqlite_master WHERE type='table';" 2>/dev/null || echo 0)"
  case "$tables" in ''|*[!0-9]*) tables=0 ;; esac
  if [ "$tables" -lt 1 ]; then
    err "$target: snapshot has no tables, so it is not the site database"
    return 1
  fi

  # 3. Keep it. The snapshot is a single file now; drop any sidecar files
  #    sqlite3 left next to it.
  rm -f "$WORK-journal" "$WORK-wal" "$WORK-shm"
  mv "$WORK" "$final"
  WORK=""
  gzip -f "$final"
  final="$final.gz"
  if ! gzip -t "$final"; then
    err "$target: the compressed archive failed its check"
    rm -f "$final"
    return 1
  fi
  chmod 600 "$final"
  size="$(du -h "$final" | cut -f1)"
  log "$target: verified (integrity ok, $tables tables), wrote $size to $final"
  VERIFIED=$((VERIFIED + 1))

  # 4. Retention, only for this target and only after a verified run.
  pruned="$(find "$BACKUP_DIR" -maxdepth 1 -type f -name "site-${target}-*.db.gz" \
    -mtime "+${RETENTION_DAYS}" -print -delete | wc -l | tr -d ' ')"
  if [ "$pruned" != "0" ]; then
    log "$target: pruned $pruned archive(s) older than ${RETENTION_DAYS} days"
  fi
  return 0
}

for t in $TARGETS; do
  if ! backup_one "$t"; then
    FAILED=$((FAILED + 1))
    cleanup
    WORK=""
  fi
done

if [ "$FAILED" -gt 0 ]; then
  err "$FAILED target(s) failed, $VERIFIED verified"
  exit 1
fi
if [ "$VERIFIED" -eq 0 ]; then
  err "no database was backed up and verified"
  exit 1
fi
log "done: $VERIFIED verified backup(s) in $BACKUP_DIR"
