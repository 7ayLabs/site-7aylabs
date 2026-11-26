#!/usr/bin/env bash
#
# site-deploy.sh: host-side deploy helper for the 7aylabs.com stack.
#
# Lives at /opt/7aylabs-site/scripts/site-deploy.sh. The Deploy and Rollback
# workflows upload the version from the commit being deployed and then call
# it over SSH as the `deploy` user. It is also the supported way to operate
# the stack by hand.
#
# Usage:
#   site-deploy.sh deploy <prod|staging> <image> [expected-sha]
#       Pull <image>, recreate the service with it, and wait until the
#       container answers /api/health on its loopback port as healthy
#       (and, when given, reporting <expected-sha>).
#   site-deploy.sh pin <prod|staging> <image>
#       Record <image> in the env file so a later hand-run `up` or a host
#       reboot starts this release. Called only after the public smoke test
#       has passed. Also prunes images unused for 72 hours.
#   site-deploy.sh status <prod|staging>
#       Show the container, the pinned image and the local health document.
#   site-deploy.sh compose <prod|staging> <docker compose args...>
#       Run docker compose with the right project files and env file.
#
# It never runs `docker compose down`: production and staging share one
# compose project, and `down` would stop both.
#
# Exit codes: 0 ok, 1 deploy or health failure, 2 usage or environment error.

set -euo pipefail

STACK_DIR="${STACK_DIR:-/opt/7aylabs-site}"
IMAGE_REPO="ghcr.io/7aylabs/site-7aylabs"
HEALTH_ATTEMPTS="${HEALTH_ATTEMPTS:-30}"   # x 3 s = 90 s

log()  { echo "[site-deploy] $*"; }
die()  { echo "[site-deploy] ERROR: $*" >&2; exit 1; }
usage() { sed -n '3,26p' "$0" | sed 's/^# \{0,1\}//'; exit 2; }

[ $# -ge 2 ] || usage
VERB="$1"
TARGET="$2"
shift 2

case "$TARGET" in
  prod)
    SERVICE="site-7aylabs"
    OVERLAY="docker-compose.prod.yml"
    ENV_FILE="$STACK_DIR/.env"
    IMAGE_VAR="SITE_IMAGE"
    PORT=7140
    ;;
  staging)
    SERVICE="site-7aylabs-staging"
    OVERLAY="docker-compose.staging.yml"
    ENV_FILE="$STACK_DIR/.env.staging"
    IMAGE_VAR="SITE_STAGING_IMAGE"
    PORT=7141
    ;;
  *)
    echo "target must be prod or staging (got: $TARGET)" >&2
    exit 2
    ;;
esac

command -v docker >/dev/null 2>&1 || { echo "docker not found" >&2; exit 2; }
[ -f "$STACK_DIR/docker-compose.yml" ] || { echo "$STACK_DIR/docker-compose.yml missing: run scripts/bootstrap-host.sh first" >&2; exit 2; }
[ -f "$STACK_DIR/$OVERLAY" ] || { echo "$STACK_DIR/$OVERLAY missing" >&2; exit 2; }
[ -f "$ENV_FILE" ] || { echo "$ENV_FILE missing: run scripts/bootstrap-host.sh first" >&2; exit 2; }

# The other environment's container belongs to the same project and is not
# an orphan; silence the warning rather than train people to ignore output.
export COMPOSE_IGNORE_ORPHANS=1

compose() {
  docker compose \
    --project-directory "$STACK_DIR" \
    --env-file "$ENV_FILE" \
    -f "$STACK_DIR/docker-compose.yml" \
    -f "$STACK_DIR/$OVERLAY" \
    "$@"
}

# Only images from this repository's package, with a plain tag. The value
# ends up in an env file and on a command line, so it is checked strictly.
check_image() {
  local img="$1"
  local prefix="${IMAGE_REPO}:"
  local tag="${img#"$prefix"}"
  if [ "$tag" = "$img" ] || ! printf '%s' "$tag" | grep -qE '^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$'; then
    echo "image must be ${IMAGE_REPO}:<tag> (got: $img)" >&2
    exit 2
  fi
}

# Prints the health document, or nothing if the container does not answer.
local_health() {
  curl -fsS --max-time 5 "http://127.0.0.1:${PORT}/api/health" 2>/dev/null || true
}

wait_healthy() {
  local expected_sha="$1" body status sqlite sha i
  for i in $(seq 1 "$HEALTH_ATTEMPTS"); do
    sleep 3
    body="$(local_health)"
    status="$(printf '%s' "$body" | jq -r '.status // "down"' 2>/dev/null || echo down)"
    sqlite="$(printf '%s' "$body" | jq -r '.subsystems.sqlite.ok // false' 2>/dev/null || echo false)"
    sha="$(printf '%s' "$body" | jq -r '.sha // "unknown"' 2>/dev/null || echo unknown)"
    log "attempt $i/$HEALTH_ATTEMPTS: status=$status sqlite=$sqlite sha=$sha"
    if [ "$status" = "healthy" ] && [ "$sqlite" = "true" ]; then
      if [ -z "$expected_sha" ] || [ "$sha" = "$expected_sha" ]; then
        return 0
      fi
    fi
  done
  return 1
}

case "$VERB" in
  deploy)
    [ $# -ge 1 ] || usage
    IMAGE="$1"
    EXPECTED_SHA="${2:-}"
    check_image "$IMAGE"
    if [ -n "$EXPECTED_SHA" ] && ! printf '%s' "$EXPECTED_SHA" | grep -qE '^[0-9a-f]{40}$'; then
      echo "expected-sha must be a full 40-character commit sha" >&2
      exit 2
    fi
    command -v curl >/dev/null 2>&1 || { echo "curl not found" >&2; exit 2; }
    command -v jq   >/dev/null 2>&1 || { echo "jq not found" >&2; exit 2; }

    # The exported value wins over the pin in the env file, so this release
    # runs now while the pin still names the last one that passed its smoke
    # test.
    export "${IMAGE_VAR}=${IMAGE}"
    log "deploying $SERVICE ($TARGET) with $IMAGE"
    compose pull "$SERVICE" || die "could not pull $IMAGE; nothing was changed"
    compose up -d --no-deps --force-recreate "$SERVICE" || die "docker compose up failed"

    if wait_healthy "$EXPECTED_SHA"; then
      log "$SERVICE is healthy on 127.0.0.1:${PORT}"
    else
      echo "[site-deploy] last 60 log lines of $SERVICE:" >&2
      docker logs --tail 60 "$SERVICE" >&2 2>&1 || true
      die "$SERVICE did not become healthy on 127.0.0.1:${PORT}"
    fi
    ;;

  pin)
    [ $# -ge 1 ] || usage
    IMAGE="$1"
    check_image "$IMAGE"
    # Rewrite through a temp file in the same directory so the env file is
    # never left half-written, and keep it private.
    TMP="$(mktemp "${ENV_FILE}.XXXXXX")"
    trap 'rm -f "$TMP"' EXIT
    chmod 600 "$TMP"
    grep -v "^${IMAGE_VAR}=" "$ENV_FILE" > "$TMP" || true
    printf '%s=%s\n' "$IMAGE_VAR" "$IMAGE" >> "$TMP"
    mv "$TMP" "$ENV_FILE"
    trap - EXIT
    log "pinned ${IMAGE_VAR}=${IMAGE} in $(basename "$ENV_FILE")"
    # Keep the disk from filling with old releases. Anything pruned can be
    # pulled again from the registry for a rollback.
    docker image prune -af --filter "until=72h" >/dev/null 2>&1 || true
    ;;

  status)
    compose ps "$SERVICE" || true
    PINNED="$(grep "^${IMAGE_VAR}=" "$ENV_FILE" | tail -n 1 | cut -d= -f2- || true)"
    log "pinned image:  ${PINNED:-<none, the overlay default tag is used>}"
    log "running image: $(docker inspect --format '{{.Config.Image}}' "$SERVICE" 2>/dev/null || echo '<no container>')"
    log "local health:  $(local_health)"
    ;;

  compose)
    case " $* " in
      *" down "*) echo "refusing to run 'down': prod and staging share this project" >&2; exit 2 ;;
    esac
    compose "$@"
    ;;

  *)
    usage
    ;;
esac
