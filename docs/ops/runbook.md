# Operations runbook: 7aylabs.com

How the site is hosted, how to set up the host from nothing, and what to do
when something goes wrong. No addresses, tokens or keys belong in this file
or anywhere else in the repository: the repository is public.

## 1. How it fits together

```
visitor
  -> Cloudflare (TLS, DNS)
  -> Cloudflare Tunnel
  -> cloudflared (systemd service on the VM)
  -> nginx on 127.0.0.1:8080
       7aylabs.com, www.7aylabs.com -> 127.0.0.1:7140  container site-7aylabs
       test.7aylabs.com             -> 127.0.0.1:7141  container site-7aylabs-staging
```

- One Vultr VM, Ubuntu 24.04. The firewall allows SSH and nothing else.
  There is no public port 80 or 443; the tunnel is an outbound connection.
- Both containers run the same image repository, `ghcr.io/7aylabs/site-7aylabs`,
  built by the Deploy workflow. Production and staging images differ only in
  the values baked in at build time (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_ENV`).
- Each container has its own SQLite database in its own Docker volume
  (`site-7aylabs-db`, `site-7aylabs-staging-db`), at `/app/.data/site.db`
  inside the container.

| Thing | Where |
| --- | --- |
| Stack directory | `/opt/7aylabs-site` (owned by `deploy`) |
| Base compose file | `/opt/7aylabs-site/docker-compose.yml` (written by the bootstrap script) |
| Overlays | `docker-compose.prod.yml`, `docker-compose.staging.yml` (uploaded by every deploy) |
| Runtime config | `/opt/7aylabs-site/.env`, `/opt/7aylabs-site/.env.staging` (mode 600) |
| Deploy helper | `/opt/7aylabs-site/scripts/site-deploy.sh` (uploaded by every deploy) |
| Backups | `/opt/7aylabs-site/backups` (root only), script `/usr/local/sbin/site-db-backup` |
| nginx | `/etc/nginx/conf.d/00-site-7aylabs-http.conf`, `/etc/nginx/snippets/site-7aylabs-proxy.conf`, `/etc/nginx/sites-available/site-7aylabs.conf` |
| Tunnel | `cloudflared.service`, token in `/etc/cloudflared/tunnel.env` (root only) |

| Branch | Environment | How it deploys |
| --- | --- | --- |
| `main` | production, https://7aylabs.com | automatically on every push |
| `testing` | staging, https://test.7aylabs.com | on request: `gh workflow run deploy.yml --ref testing` |

## 2. First-time setup

### 2.1 What you create by hand

1. **Two SSH key pairs**, on your own machine. One for CI, one for you.

   ```sh
   ssh-keygen -t ed25519 -N '' -C ci-deploy -f ./ci-deploy
   ssh-keygen -t ed25519 -C admin -f ~/.ssh/7aylabs-admin
   ```

   The CI key has no passphrase because GitHub Actions uses it unattended.
   Keep `ci-deploy` (the private half) only long enough to paste it into
   the GitHub secret, then delete the file.

2. **The VM**, in Vultr: Ubuntu 24.04, 1 vCPU / 2 GB. Add your admin public
   key at creation so the first login as `root` works. Recommended:
   - turn on automatic backups for the instance (this is the only copy of
     the data that lives off the machine, see section 6);
   - attach a firewall group that allows inbound TCP on your SSH port only.

3. **A Cloudflare Tunnel**, in the Cloudflare Zero Trust dashboard
   (Networks, Tunnels, create a tunnel of type "Cloudflared"). Copy the
   tunnel token. Do not add public hostnames yet; that is step 2.5.

### 2.2 Run the bootstrap script

Log in as `root` and get the repository onto the machine. It is public, so
a clone needs no credentials:

```sh
git clone https://github.com/7ayLabs/site-7aylabs.git /root/site-7aylabs
cd /root/site-7aylabs
```

Put the tunnel token in a file so it stays out of the shell history, then
run the script:

```sh
install -m 600 /dev/null /root/tunnel-token
nano /root/tunnel-token          # paste the token, save

DEPLOY_PUBKEY="ssh-ed25519 AAAA... ci-deploy" \
ADMIN_USER=admin \
ADMIN_PUBKEY="ssh-ed25519 AAAA... admin" \
SSH_PORT=22 \
CF_TUNNEL_TOKEN_FILE=/root/tunnel-token \
  bash scripts/bootstrap-host.sh

shred -u /root/tunnel-token
```

What the settings mean:

| Setting | Meaning |
| --- | --- |
| `DEPLOY_PUBKEY` | Public half of the CI key. Required on the first run. |
| `ADMIN_USER`, `ADMIN_PUBKEY` | A second account, for you, with sudo. Strongly recommended: root login over SSH is switched off, and without an admin account the only way to become root is the Vultr web console. |
| `SSH_PORT` | Port for sshd. Default 22. If you change it, use the same value in the `VPS_PORT` secret and in the Vultr firewall group. |
| `CF_TUNNEL_TOKEN_FILE` | File holding the tunnel token. Without it, cloudflared is installed but not started; run the script again later with the token. |
| `AUTO_REBOOT` | `1` (default) lets security updates reboot the machine at 04:30 UTC when a kernel update needs it. The site is back in under a minute. `0` turns that off. |

The script can be run again at any time. It never overwrites an existing
`.env` or `.env.staging`. Run it again after pulling changes to
`docs/ops/nginx/` or `scripts/db-backup.sh`, which is how those reach the
host.

**Before you close the root session**, open a second terminal and check
that both logins work:

```sh
ssh -p <port> -i ~/.ssh/7aylabs-admin admin@<host>
ssh -p <port> -i ./ci-deploy deploy@<host> docker ps
```

### 2.3 GitHub repository secrets

Settings, Secrets and variables, Actions, "New repository secret":

| Secret | Value |
| --- | --- |
| `VPS_HOST` | The VM's address |
| `VPS_USER` | `deploy` |
| `VPS_PORT` | The SSH port (may be omitted when it is 22) |
| `VPS_SSH_KEY` | The whole `ci-deploy` private key file, including the BEGIN and END lines |
| `VPS_KNOWN_HOSTS` | Output of `ssh-keyscan -p <port> -t ed25519 <host>`, run from your machine |

`VPS_KNOWN_HOSTS` pins the host key: the workflows refuse to connect to a
machine that presents a different one. Before saving it, compare its
fingerprint with the one the bootstrap script printed:

```sh
ssh-keyscan -p <port> -t ed25519 <host> | ssh-keygen -lf -
```

If the VM is ever rebuilt, this secret must be updated.

### 2.4 Review the env files

```sh
sudo -u deploy nano /opt/7aylabs-site/.env
sudo -u deploy nano /opt/7aylabs-site/.env.staging
```

| Variable | Notes |
| --- | --- |
| `ALLOWED_ORIGINS` | Comma-separated origins allowed to POST to `/api/*`. Pre-filled. |
| `RATE_LIMIT_SALT` | Generated by the bootstrap script. Leave it. |
| `SITE_DATA_DIR` | `/app/.data`. Leave it. |
| `RESEND_API_KEY`, `CONTACT_NOTIFY_TO`, `CONTACT_FROM` | Optional. Without them contact messages are stored but not emailed. |
| `SITE_IMAGE` / `SITE_STAGING_IMAGE` | Written by the deploy workflow. Do not edit by hand. |

### 2.5 Staging first

1. In the Cloudflare tunnel, add a public hostname `test.7aylabs.com` with
   service `http://127.0.0.1:8080`. If `test.7aylabs.com` already has a DNS
   record (for example pointing at the old host's tunnel), delete that
   record or the old tunnel's hostname first; Cloudflare creates the new one.
2. Start a staging deploy:

   ```sh
   gh workflow run deploy.yml --ref testing
   ```

3. The first run builds and pushes the image, which creates the package
   `site-7aylabs` under the organisation's Packages. **New packages are
   private**, so the host cannot pull it and the "Recreate the service"
   step fails. Open the package settings, change its visibility to public,
   then use "Re-run failed jobs" on the workflow run.

   If the package must stay private instead: create a token with only the
   `read:packages` scope and run, as `deploy` on the host,
   `docker login ghcr.io -u <github user>` and paste the token.
4. Check: `curl -s https://test.7aylabs.com/api/health` shows
   `"status":"healthy"`, and `curl -sI https://test.7aylabs.com` shows
   `x-robots-tag: noindex, nofollow`.

### 2.6 Production and the DNS cutover from the old host

Until DNS is moved, `7aylabs.com` is still answered by the old host, so the
public smoke test of a production deploy cannot pass. The order that keeps
the site up throughout:

1. Before anything else, export whatever data must be kept from the old
   host (form submissions, the old database). Nothing is migrated
   automatically.
2. Merge to `main`. The Deploy workflow builds the image and the "Recreate
   the service" step starts it on the new host and verifies it there. The
   "Smoke test" step then fails, because the public name still reaches the
   old host. That red run is expected this one time.
3. On the new host, confirm production is ready:

   ```sh
   /opt/7aylabs-site/scripts/site-deploy.sh status prod
   curl -s -H 'Host: 7aylabs.com' http://127.0.0.1:8080/api/health
   ```

4. In Cloudflare, add the public hostnames `7aylabs.com` and
   `www.7aylabs.com` to the new tunnel, each with service
   `http://127.0.0.1:8080`, replacing the existing DNS records for those
   names. Because the records are proxied, the change takes effect within
   seconds and there is no TTL to wait for.
5. Use "Re-run failed jobs" on the Deploy run. It now passes and pins the
   image.
6. In Cloudflare, check that "Always Use HTTPS" is on for the zone (nginx
   tells the app every request is HTTPS).
7. Leave the old host running, untouched, for a few days as a fallback (to
   go back, point the DNS records at it again). Then remove its tunnel,
   its DNS leftovers and the machine, and delete any GitHub secrets that
   were only used by the old pipeline.

## 3. Everyday operations

All commands run on the host as `deploy` (or with `sudo -u deploy`).

```sh
cd /opt/7aylabs-site

scripts/site-deploy.sh status prod              # container, pinned image, health
scripts/site-deploy.sh status staging
docker logs --tail 100 -f site-7aylabs          # application logs
scripts/site-deploy.sh compose prod ps          # any docker compose command
```

**After changing an env file**, recreate that one container:

```sh
scripts/site-deploy.sh compose prod up -d --no-deps --force-recreate site-7aylabs
scripts/site-deploy.sh compose staging up -d --no-deps --force-recreate site-7aylabs-staging
```

**Never run `docker compose down`** in this directory. Production and
staging share one compose project and `down` stops both. The helper refuses it.

Values that start with `NEXT_PUBLIC_` are baked into the image when it is
built. Changing them means changing `deploy.yml` and deploying, not editing
an env file.

**Host maintenance.** Security updates install themselves. Docker and
cloudflared come from their own package repositories and are not covered by
that, so about once a month, as the admin user:

```sh
sudo apt update && sudo apt upgrade
```

## 4. Deploying

- **Production:** merge to `main`. Runs: resolve, build and push, upload the
  overlays and helper, recreate the service, smoke test, pin.
- **Staging:** `gh workflow run deploy.yml --ref testing`.
- **Redeploy production without a new commit:** `gh workflow run deploy.yml --ref main`.

The smoke test polls `<site>/api/health` for up to two minutes and requires
`status == "healthy"`, `subsystems.sqlite.ok == true` and `sha` equal to the
commit that was deployed. The image is written to the env file ("pinned")
only after that passes.

If a deploy goes red:

| Failed step | What it means | State of the site |
| --- | --- | --- |
| Build and push | The image did not build. | Unchanged. |
| Upload to the host | SSH problem (see section 7). | Unchanged. |
| Recreate the service | The image could not be pulled (site unchanged), or the new container did not become healthy on the host. The last log lines are in the step output. | If it was the health check: the new, unhealthy container is running. Roll back. |
| Smoke test | The container is healthy on the host but the public URL did not show it. | New container is serving; the path from the internet is the problem (DNS, tunnel, nginx, a Cloudflare rule). |

## 5. Rolling back

```sh
gh workflow run rollback.yml -f image_sha=<commit sha of the last good release> -f target=prod
```

or Actions, Rollback, Run workflow. Use `target=staging` for staging. The
sha may be shortened to 7 characters. Nothing is rebuilt: the workflow
checks that the commit is on the target's branch, starts the image
`<branch>-<full sha>` that was built for it, runs the same smoke test, and
moves the pin. It waits for any deploy of the same target that is running.

To find the last good release: the list of successful Deploy runs, or the
tags of the package in the registry.

By hand on the host, if GitHub is unavailable:

```sh
cd /opt/7aylabs-site
scripts/site-deploy.sh deploy prod ghcr.io/7aylabs/site-7aylabs:main-<full sha>
scripts/site-deploy.sh pin    prod ghcr.io/7aylabs/site-7aylabs:main-<full sha>
```

A rollback changes the code, not the data. The database stays as it is.

## 6. Backups and restore

**What runs.** `/usr/local/sbin/site-db-backup` takes an online snapshot of
each database, checks it (`PRAGMA integrity_check`, at least one table),
compresses it into `/opt/7aylabs-site/backups/site-<target>-<UTC time>.db.gz`
and deletes archives older than 14 days. It runs twice a day: from the
systemd timer `site-db-backup.timer` and from the "DB backup" workflow,
which goes red if the script did not produce a verified backup. A staging
database that does not exist yet is skipped with a message.

```sh
sudo /usr/local/sbin/site-db-backup            # run now (both)
sudo /usr/local/sbin/site-db-backup prod       # one target
sudo ls -lh /opt/7aylabs-site/backups
systemctl list-timers site-db-backup.timer
journalctl -u site-db-backup.service -n 50
```

**What this does not cover.** The archives live on the same machine as the
databases. They protect against a bad release or a damaged file, not against
losing the VM. For that, keep Vultr's automatic instance backups on, or copy
`/opt/7aylabs-site/backups` somewhere else on a schedule.

**Restore** (as root; the example restores production):

```sh
# 1. Pick an archive and unpack it to a scratch file
ls -lh /opt/7aylabs-site/backups
gunzip -c /opt/7aylabs-site/backups/site-prod-<time>.db.gz > /root/restore.db
sqlite3 /root/restore.db "PRAGMA integrity_check;"        # must print: ok

# 2. Stop the container so nothing writes to the database
docker stop site-7aylabs

# 3. Keep the current file, put the restored one in place
VOL="$(docker volume inspect --format '{{ .Mountpoint }}' site-7aylabs-db)"
mv "$VOL/site.db" "$VOL/site.db.before-restore"
rm -f "$VOL/site.db-wal" "$VOL/site.db-shm"
install -m 644 -o 1001 -g 1001 /root/restore.db "$VOL/site.db"

# 4. Start it again and check
docker start site-7aylabs
curl -s http://127.0.0.1:7140/api/health
rm /root/restore.db
```

For staging use `site-7aylabs-staging`, `site-7aylabs-staging-db` and port
7141. Remove `site.db.before-restore` once the site has been checked.
Practise this on staging once, so the first real restore is not the first
restore.

## 7. Troubleshooting

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Workflow step fails with `Host key verification failed` | The VM was rebuilt, or `VPS_KNOWN_HOSTS` was taken with a different port. | Regenerate the secret (section 2.3) after confirming the fingerprint on the host: `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`. |
| `vps-ssh: SSH_KNOWN is empty` or another input is empty | A repository secret is missing. | Add it (section 2.3). |
| `Permission denied (publickey)` | `VPS_SSH_KEY` does not match the key in `/home/deploy/.ssh/authorized_keys`, or `VPS_USER` is not `deploy`. | Fix the secret, or run the bootstrap script again with the right `DEPLOY_PUBKEY`. |
| SSH from CI times out | Vultr firewall group or `VPS_PORT` does not match the sshd port; or fail2ban banned the address. | Check both ports. `sudo fail2ban-client status sshd`, `sudo fail2ban-client set sshd unbanip <address>`. |
| "Recreate the service": `could not pull` | The package is private, or the tag does not exist. | Make the package public or `docker login ghcr.io` as `deploy` (section 2.5). |
| "Recreate the service": never healthy | The app fails to start. | Read the log lines in the step output, or `docker logs site-7aylabs`. Common: a missing value in the env file; a path the app tries to write to (the root filesystem is read-only, only `/app/.data`, `/tmp` and `/app/.next/cache` are writable). Roll back meanwhile. |
| Smoke test fails, sha is an older commit | The public name reaches another machine, or a cached response. | Check the tunnel's public hostnames and the DNS records. |
| Smoke test fails with `status=down`, site works in a browser | Cloudflare is challenging requests that come from GitHub's network (Bot Fight Mode or a WAF rule). | Add a WAF rule that skips challenges for the path `/api/health`, or turn Bot Fight Mode off. |
| Browser shows Cloudflare error 1033 or 530 | The tunnel is not connected. | `systemctl status cloudflared`, `journalctl -u cloudflared -n 50`. If the token was replaced, run the bootstrap script again with the new one. |
| Browser shows 502 | nginx is up but the container is not answering. | `scripts/site-deploy.sh status prod`, `docker logs site-7aylabs`. |
| Connection closed with no response for a hostname | The hostname is not in `site-7aylabs.conf`, so the catch-all block dropped it. | Add it to `docs/ops/nginx/site-7aylabs.conf`, pull on the host, run the bootstrap script again. |
| HTTP 429 on `/api/...` | The nginx rate limit (10 requests per second per visitor, burst 20) or the app's own limit. | Expected under abuse. If real users hit it, adjust `docs/ops/nginx/`. |
| Every visitor seems to share one address in the app | `CF-Connecting-IP` is not reaching nginx. | Requests must come through the tunnel. Check `/etc/nginx/conf.d/00-site-7aylabs-http.conf` is installed. |
| Forms rejected with an origin error | `ALLOWED_ORIGINS` in the env file does not list the origin in use. | Fix the env file and recreate the container (section 3). |
| "DB backup" workflow is red | The script found a database it could not back up, or verified nothing. | `journalctl -u site-db-backup.service`, or run it by hand (section 6). `sudo: a password is required` means the sudoers entry is missing: run the bootstrap script again. |
| Disk filling up | Old images or logs. | `docker system df`, `docker image prune -af --filter until=72h`. Container logs are capped at 3 x 10 MB each. |
| Container restarts in a loop, `OOMKilled` | The 512 MB memory limit. | `docker inspect -f '{{.State.OOMKilled}}' site-7aylabs`. Raise `mem_limit` in the overlay if the usage is legitimate. |
| Locked out of SSH | Key lost, or sshd settings wrong. | Use the Vultr web console to log in as root, fix `/etc/ssh/sshd_config.d/00-site-hardening.conf` or the `authorized_keys` file, then `systemctl restart ssh`. |

## Reading what the site has stored

`/opt/7aylabs-site/scripts/site-data.sh` runs on the host as the `deploy` user. It reads the database from inside the site's container, so it needs no extra access.

```bash
scripts/site-data.sh messages prod 20      # the last 20 contact messages
scripts/site-data.sh subscribers prod      # how many active subscribers
scripts/site-data.sh export prod > subs.csv
scripts/site-data.sh handled prod 12       # mark message 12 as handled
```

Use `staging` in place of `prod` for the staging database.

## Email (optional)

With `RESEND_API_KEY` set in the host env file, the site sends a welcome email with an unsubscribe link to new subscribers and a receipt to people who use the contact form, and copies each contact message to `CONTACT_NOTIFY_TO`. Without the key nothing is sent; everything is still stored. Unsubscribe links are signed with `SITE_SECRET`, or with `RATE_LIMIT_SALT` when `SITE_SECRET` is not set.
