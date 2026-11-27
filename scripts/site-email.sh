#!/usr/bin/env bash
#
# site-email.sh: switch the site's outgoing email on or off, on the host.
#
#   site-email.sh status           say whether email is on, per environment
#   site-email.sh on  [TEAM_ADDR]  ask for the Resend key (typed hidden), store
#                                  it for prod and staging, restart both
#   site-email.sh off              remove the key from both, restart both
#
# TEAM_ADDR is where a copy of each contact message goes; leave it out to
# keep the current one. The key is read from the terminal and written only
# to the two env files (mode 600). It is never an argument, so it does not
# land in the shell history or the process list.
#
# Run as the deploy user (it owns the env files and is in the docker group).

set -euo pipefail

STACK_DIR="/opt/7aylabs-site"
DEPLOY="$STACK_DIR/scripts/site-deploy.sh"

env_file() { if [ "$1" = prod ]; then echo "$STACK_DIR/.env"; else echo "$STACK_DIR/.env.staging"; fi; }
service() { if [ "$1" = prod ]; then echo "site-7aylabs"; else echo "site-7aylabs-staging"; fi; }

# Replace (or add, or with an empty value remove) one KEY=value line.
set_var() {
  local file="$1" key="$2" value="$3" tmp
  tmp="$(mktemp "${file}.XXXXXX")"
  chmod 600 "$tmp"
  grep -v "^${key}=" "$file" > "$tmp" || true
  [ -z "$value" ] || printf '%s=%s\n' "$key" "$value" >> "$tmp"
  mv "$tmp" "$file"
}

restart() {
  bash "$DEPLOY" compose "$1" up -d --no-deps --force-recreate "$(service "$1")" >/dev/null
  echo "restarted $1"
}

cmd="${1:-}"
case "$cmd" in
  status)
    for t in prod staging; do
      f="$(env_file "$t")"
      if grep -q '^RESEND_API_KEY=.' "$f"; then
        to="$(grep '^CONTACT_NOTIFY_TO=' "$f" | tail -n 1 | cut -d= -f2- || true)"
        echo "$t: on (copies of contact messages go to ${to:-nobody})"
      else
        echo "$t: off"
      fi
    done
    ;;
  on)
    team="${2:-}"
    [ -t 0 ] || { echo "run this in a terminal: the key is typed, not piped" >&2; exit 2; }
    printf 'Resend API key (hidden): '
    IFS= read -rs key
    echo
    case "$key" in
      re_*) ;;
      *) echo "that does not look like a Resend key (they start with re_)" >&2; exit 2 ;;
    esac
    for t in prod staging; do
      f="$(env_file "$t")"
      set_var "$f" RESEND_API_KEY "$key"
      [ -z "$team" ] || set_var "$f" CONTACT_NOTIFY_TO "$team"
      restart "$t"
    done
    unset key
    echo "email is on"
    ;;
  off)
    for t in prod staging; do
      set_var "$(env_file "$t")" RESEND_API_KEY ""
      restart "$t"
    done
    echo "email is off"
    ;;
  *)
    sed -n '3,15p' "$0" | sed 's/^# \{0,1\}//'
    exit 2
    ;;
esac
