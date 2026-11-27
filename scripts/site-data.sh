#!/usr/bin/env bash
#
# site-data.sh: read what the site has stored, on the host.
#
#   site-data.sh messages    [prod|staging] [N]   the last N contact messages (default 20)
#   site-data.sh subscribers [prod|staging]       count of active subscribers
#   site-data.sh export      [prod|staging]       active subscribers as CSV on stdout
#   site-data.sh handled     [prod|staging] ID    mark a contact message as handled
#
# It runs inside the site's container, with the database library the site
# itself uses, so it needs only the `docker` group (the deploy user has it).
# Read-only, except `handled`.

set -euo pipefail

cmd="${1:-}"
target="${2:-prod}"
arg="${3:-}"

case "$target" in
  prod) container="site-7aylabs" ;;
  staging) container="site-7aylabs-staging" ;;
  *) echo "target must be prod or staging" >&2; exit 2 ;;
esac

case "$cmd" in
  messages)
    n="${arg:-20}"; case "$n" in ''|*[!0-9]*) echo "N must be a number" >&2; exit 2 ;; esac
    js="const r=db.prepare('SELECT id,created_at,topic,name,email,handled,message FROM contact_messages ORDER BY id DESC LIMIT ?').all(${n});for(const m of r){console.log('#'+m.id+'  '+m.created_at+'  ['+m.topic+']'+(m.handled?'  handled':''));console.log('  '+m.name+' <'+m.email+'>');console.log('  '+String(m.message).replace(/\\n/g,'\\n  '));console.log('')}if(!r.length)console.log('no messages')"
    ;;
  subscribers)
    js="console.log(db.prepare('SELECT COUNT(*) n FROM newsletter_subscribers WHERE active=1').get().n+' active subscribers')"
    ;;
  export)
    js="console.log('email,locale,subscribed_at');for(const s of db.prepare('SELECT email,locale,created_at FROM newsletter_subscribers WHERE active=1 ORDER BY id').all())console.log([s.email,s.locale,s.created_at].join(','))"
    ;;
  handled)
    case "$arg" in ''|*[!0-9]*) echo "ID must be a number" >&2; exit 2 ;; esac
    js="const r=db.prepare('UPDATE contact_messages SET handled=1 WHERE id=?').run(${arg});console.log(r.changes?'marked #${arg} as handled':'no message #${arg}')"
    ;;
  *)
    sed -n '3,12p' "$0" | sed 's/^# \{0,1\}//'; exit 2 ;;
esac

exec docker exec -i "$container" node -e "const D=require('better-sqlite3');const db=new D(process.env.SITE_DATA_DIR+'/site.db');${js}"
