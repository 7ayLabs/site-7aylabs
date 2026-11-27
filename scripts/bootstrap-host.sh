#!/usr/bin/env bash
#
# bootstrap-host.sh: one-time setup of the VM that serves 7aylabs.com.
#
# Run as root on a fresh Ubuntu 24.04 machine. Safe to run again: every
# step checks what is already there, and existing env files are never
# overwritten.
#
# Usage (from a checkout, or with the files listed below copied next to it):
#
#   DEPLOY_PUBKEY="ssh-ed25519 AAAA... ci-deploy" \
#   CF_TUNNEL_TOKEN_FILE=/root/tunnel-token \
#     bash scripts/bootstrap-host.sh
#
# Settings (environment variables):
#   DEPLOY_PUBKEY         Public key for the `deploy` user (the key CI uses).
#                         Required on the first run. --deploy-pubkey also works.
#   SSH_PORT              sshd port. Default 22.
#   ADMIN_USER            Optional. A second user with sudo, for people.
#   ADMIN_PUBKEY          Public key for ADMIN_USER (required with it).
#   CF_TUNNEL_TOKEN       Cloudflare Tunnel token. Optional; without it
#   CF_TUNNEL_TOKEN_FILE  cloudflared is installed but not started. The
#                         file form keeps the token out of shell history.
#   AUTO_REBOOT           1 (default) lets unattended-upgrades reboot at
#                         04:30 UTC when a kernel update needs it. 0 = never.
#   SWAP_SIZE_MB          Size of the swap file created when the machine has
#                         no swap. Default 1024. 0 = do not create one.
#
# Files it installs when it finds them (repo layout, or flat next to this
# script): docs/ops/nginx/*.conf, scripts/db-backup.sh,
# scripts/site-deploy.sh, docker-compose.prod.yml, docker-compose.staging.yml.
#
# What it sets up:
#   users     `deploy` (docker group, key-only), optional admin with sudo
#   sshd      key-only, no root login, optional custom port
#   firewall  ufw: deny incoming, allow SSH only
#   fail2ban, unattended-upgrades, swap file
#   Docker Engine + compose plugin (Docker's apt repository)
#   /opt/7aylabs-site with the base compose file and both env files
#   nginx on 127.0.0.1:8080, cloudflared (Cloudflare's apt repository)
#   sqlite3, the backup script and its daily systemd timer

set -euo pipefail

# ── Settings ─────────────────────────────────────────────────────────────
DEPLOY_USER="deploy"
DEPLOY_PUBKEY="${DEPLOY_PUBKEY:-}"
SSH_PORT="${SSH_PORT:-22}"
ADMIN_USER="${ADMIN_USER:-}"
ADMIN_PUBKEY="${ADMIN_PUBKEY:-}"
CF_TUNNEL_TOKEN="${CF_TUNNEL_TOKEN:-}"
CF_TUNNEL_TOKEN_FILE="${CF_TUNNEL_TOKEN_FILE:-}"
AUTO_REBOOT="${AUTO_REBOOT:-1}"
SWAP_SIZE_MB="${SWAP_SIZE_MB:-1024}"

STACK_DIR="/opt/7aylabs-site"
BACKUP_BIN="/usr/local/sbin/site-db-backup"

while [ $# -gt 0 ]; do
  case "$1" in
    --deploy-pubkey) DEPLOY_PUBKEY="${2:-}"; shift 2 ;;
    --ssh-port)      SSH_PORT="${2:-}"; shift 2 ;;
    -h|--help)       sed -n '3,41p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)               echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

step() { echo; echo "==> $*"; }
info() { echo "    $*"; }
warn() { echo "    WARNING: $*" >&2; }
die()  { echo "ERROR: $*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "run this script as root"
# shellcheck disable=SC1091
. /etc/os-release
[ "${ID:-}" = "ubuntu" ] || die "this script supports Ubuntu only (found: ${ID:-unknown})"
[ "${VERSION_ID:-}" = "24.04" ] || warn "written for Ubuntu 24.04, found ${VERSION_ID:-unknown}"

case "$SSH_PORT" in
  ''|*[!0-9]*) die "SSH_PORT must be a number" ;;
esac
{ [ "$SSH_PORT" -ge 1 ] && [ "$SSH_PORT" -le 65535 ]; } || die "SSH_PORT out of range"
case "$SSH_PORT" in
  8080|7140|7141) die "SSH_PORT $SSH_PORT is used by the site stack" ;;
esac

valid_pubkey() {
  printf '%s' "$1" | grep -qE '^(ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp(256|384|521)|sk-ssh-ed25519@openssh\.com|sk-ecdsa-sha2-nistp256@openssh\.com) [A-Za-z0-9+/=]+( .*)?$'
}
[ -z "$DEPLOY_PUBKEY" ] || valid_pubkey "$DEPLOY_PUBKEY" || die "DEPLOY_PUBKEY is not a single public key line"
if [ -n "$ADMIN_USER" ]; then
  printf '%s' "$ADMIN_USER" | grep -qE '^[a-z][a-z0-9_-]{0,30}$' || die "ADMIN_USER is not a valid user name"
  [ "$ADMIN_USER" != "$DEPLOY_USER" ] || die "ADMIN_USER must differ from $DEPLOY_USER"
  [ "$ADMIN_USER" != "root" ] || die "ADMIN_USER cannot be root"
  [ -z "$ADMIN_PUBKEY" ] || valid_pubkey "$ADMIN_PUBKEY" || die "ADMIN_PUBKEY is not a single public key line"
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# Finds a file in the repo layout or flat next to this script.
#   find_asset <repo-relative path>   -> prints the path, or nothing
find_asset() {
  local rel="$1" c
  for c in "$SCRIPT_DIR/../$rel" "$SCRIPT_DIR/$rel" "$SCRIPT_DIR/$(basename "$rel")"; do
    if [ -f "$c" ]; then
      printf '%s\n' "$c"
      return 0
    fi
  done
  return 0
}

export DEBIAN_FRONTEND=noninteractive
# A fresh machine usually has its own first update running. Wait for the
# package lock (up to ten minutes) instead of failing on it.
APT_WAIT=(-o DPkg::Lock::Timeout=600)
apt_install() { apt-get "${APT_WAIT[@]}" install -y --no-install-recommends "$@" >/dev/null; }

# ── 1. Base packages ─────────────────────────────────────────────────────
step "Base packages"
apt-get "${APT_WAIT[@]}" update -qq
apt_install ca-certificates curl gnupg jq openssl sqlite3 ufw fail2ban \
  unattended-upgrades apt-listchanges util-linux
info "installed"

# ── 2. Users ─────────────────────────────────────────────────────────────
step "Users"

# add_key <user> <public key line>
add_key() {
  local user="$1" key="$2" home sshdir auth
  home="$(getent passwd "$user" | cut -d: -f6)"
  sshdir="$home/.ssh"
  auth="$sshdir/authorized_keys"
  install -d -m 700 -o "$user" -g "$user" "$sshdir"
  touch "$auth"
  if [ -n "$key" ] && ! grep -qxF "$key" "$auth"; then
    printf '%s\n' "$key" >> "$auth"
    info "added a key for $user"
  fi
  chown "$user:$user" "$auth"
  chmod 600 "$auth"
}

has_key() {
  local home
  home="$(getent passwd "$1" | cut -d: -f6)"
  [ -n "$home" ] && [ -s "$home/.ssh/authorized_keys" ] && grep -qE '^[a-z]' "$home/.ssh/authorized_keys"
}

if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER" >/dev/null
  info "created user $DEPLOY_USER"
fi
add_key "$DEPLOY_USER" "$DEPLOY_PUBKEY"
has_key "$DEPLOY_USER" || die "$DEPLOY_USER has no authorized key. Pass DEPLOY_PUBKEY on the first run."

ALLOW_USERS="$DEPLOY_USER"
if [ -n "$ADMIN_USER" ]; then
  if ! id "$ADMIN_USER" >/dev/null 2>&1; then
    adduser --disabled-password --gecos "" "$ADMIN_USER" >/dev/null
    info "created user $ADMIN_USER"
  fi
  add_key "$ADMIN_USER" "$ADMIN_PUBKEY"
  has_key "$ADMIN_USER" || die "$ADMIN_USER has no authorized key. Pass ADMIN_PUBKEY."
  usermod -aG sudo "$ADMIN_USER"
  # Key-only accounts have no password, so sudo cannot ask for one.
  printf '%s ALL=(ALL) NOPASSWD:ALL\n' "$ADMIN_USER" > /etc/sudoers.d/90-site-admin.tmp
  visudo -cf /etc/sudoers.d/90-site-admin.tmp >/dev/null || die "sudoers entry for $ADMIN_USER failed validation"
  chmod 440 /etc/sudoers.d/90-site-admin.tmp
  mv /etc/sudoers.d/90-site-admin.tmp /etc/sudoers.d/90-site-admin
  ALLOW_USERS="$ALLOW_USERS $ADMIN_USER"
  info "$ADMIN_USER can use sudo"
elif [ -f /etc/sudoers.d/90-site-admin ]; then
  # An admin from an earlier run stays allowed in.
  PREV_ADMIN="$(cut -d' ' -f1 /etc/sudoers.d/90-site-admin)"
  if id "$PREV_ADMIN" >/dev/null 2>&1; then
    ALLOW_USERS="$ALLOW_USERS $PREV_ADMIN"
  fi
fi

# ── 3. Firewall ──────────────────────────────────────────────────────────
# Opened for the new SSH port BEFORE sshd moves, so a run over SSH cannot
# cut itself off.
step "Firewall (ufw)"
ufw default deny incoming >/dev/null
ufw default allow outgoing >/dev/null
ufw allow "${SSH_PORT}/tcp" comment 'ssh' >/dev/null
ufw --force enable >/dev/null
info "deny incoming, allow ${SSH_PORT}/tcp"

# ── 4. sshd ──────────────────────────────────────────────────────────────
step "sshd hardening"
install -d -m 755 /etc/ssh/sshd_config.d
grep -qE '^\s*Include\s+/etc/ssh/sshd_config\.d/\*\.conf' /etc/ssh/sshd_config \
  || sed -i '1i Include /etc/ssh/sshd_config.d/*.conf' /etc/ssh/sshd_config

# sshd uses the FIRST value it reads for each keyword, and cloud images ship
# a 50-cloud-init.conf that turns password login on. The 00- prefix makes
# this file win.
SSHD_DROPIN="/etc/ssh/sshd_config.d/00-site-hardening.conf"
cat > "${SSHD_DROPIN}.tmp" <<EOF
# Managed by scripts/bootstrap-host.sh. Re-run the script to change it.
Port ${SSH_PORT}
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitEmptyPasswords no
AuthenticationMethods publickey
AllowUsers ${ALLOW_USERS}
MaxAuthTries 3
LoginGraceTime 30
X11Forwarding no
AllowAgentForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
EOF
mv "${SSHD_DROPIN}.tmp" "$SSHD_DROPIN"
chmod 644 "$SSHD_DROPIN"
install -d -m 755 /run/sshd
if ! sshd -t; then
  rm -f "$SSHD_DROPIN"
  die "sshd rejected the new configuration; the drop-in was removed and sshd left as it was"
fi

# Ubuntu 24.04 starts sshd through ssh.socket, and the listening port comes
# from a generator that reads sshd_config at daemon-reload.
systemctl daemon-reload
if systemctl is-enabled --quiet ssh.socket 2>/dev/null || systemctl is-active --quiet ssh.socket 2>/dev/null; then
  systemctl restart ssh.socket
fi
# Restart a running daemon so it re-reads the settings (open sessions
# survive this). With socket activation and no daemon running, the next
# connection starts one with the new configuration.
systemctl try-restart ssh.service 2>/dev/null || true
if ! systemctl is-active --quiet ssh.socket 2>/dev/null && ! systemctl is-active --quiet ssh.service 2>/dev/null; then
  systemctl start ssh.service
fi
sleep 2

if ss -H -ltn "sport = :${SSH_PORT}" | grep -q .; then
  info "sshd listens on ${SSH_PORT}: key-only, no root login, users: ${ALLOW_USERS}"
  if [ "$SSH_PORT" != "22" ]; then
    ufw delete allow 22/tcp >/dev/null 2>&1 || true
    ufw delete allow OpenSSH >/dev/null 2>&1 || true
    info "closed 22/tcp in the firewall"
  fi
else
  warn "nothing is listening on ${SSH_PORT} yet. Port 22 was left open in the firewall."
  warn "Check 'systemctl status ssh ssh.socket' before closing this session."
  if [ "$SSH_PORT" != "22" ]; then ufw allow 22/tcp >/dev/null; fi
fi

# ── 5. fail2ban ──────────────────────────────────────────────────────────
step "fail2ban"
cat > /etc/fail2ban/jail.d/sshd.local <<EOF
# Managed by scripts/bootstrap-host.sh
[sshd]
enabled  = true
port     = ${SSH_PORT}
backend  = systemd
maxretry = 5
findtime = 10m
bantime  = 1h
EOF
systemctl enable fail2ban >/dev/null 2>&1
systemctl restart fail2ban
info "sshd jail on port ${SSH_PORT}"

# ── 6. Unattended upgrades ───────────────────────────────────────────────
step "Unattended security upgrades"
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
if [ "$AUTO_REBOOT" = "1" ]; then REBOOT_VALUE="true"; else REBOOT_VALUE="false"; fi
cat > /etc/apt/apt.conf.d/52site-unattended-upgrades <<EOF
// Managed by scripts/bootstrap-host.sh
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "${REBOOT_VALUE}";
Unattended-Upgrade::Automatic-Reboot-Time "04:30";
EOF
systemctl enable --now unattended-upgrades >/dev/null 2>&1 || true
info "enabled (automatic reboot: ${REBOOT_VALUE})"

# ── 7. Swap ──────────────────────────────────────────────────────────────
step "Swap"
case "$SWAP_SIZE_MB" in ''|*[!0-9]*) die "SWAP_SIZE_MB must be a number" ;; esac
if [ -n "$(swapon --noheadings --show=NAME 2>/dev/null)" ]; then
  info "swap already present"
elif [ "$SWAP_SIZE_MB" -eq 0 ]; then
  info "skipped (SWAP_SIZE_MB=0)"
else
  if [ ! -f /swapfile ]; then
    fallocate -l "${SWAP_SIZE_MB}M" /swapfile
    chmod 600 /swapfile
    mkswap /swapfile >/dev/null
  fi
  swapon /swapfile
  grep -qE '^/swapfile\s' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  info "created a ${SWAP_SIZE_MB} MB swap file"
fi

# ── 8. Docker ────────────────────────────────────────────────────────────
step "Docker Engine"
install -d -m 755 /etc/apt/keyrings
if [ ! -s /etc/apt/keyrings/docker.asc ]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
fi
DOCKER_LIST="deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable"
if [ "$(cat /etc/apt/sources.list.d/docker.list 2>/dev/null || true)" != "$DOCKER_LIST" ]; then
  echo "$DOCKER_LIST" > /etc/apt/sources.list.d/docker.list
  apt-get "${APT_WAIT[@]}" update -qq
fi
apt_install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
if [ ! -f /etc/docker/daemon.json ]; then
  install -d -m 755 /etc/docker
  cat > /etc/docker/daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" },
  "live-restore": true
}
EOF
  systemctl restart docker
fi
systemctl enable --now docker >/dev/null 2>&1
usermod -aG docker "$DEPLOY_USER"
info "$(docker --version)"
info "$(docker compose version)"

# ── 9. Stack directory ───────────────────────────────────────────────────
step "Stack directory $STACK_DIR"
install -d -m 750 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$STACK_DIR" "$STACK_DIR/scripts"
install -d -m 700 -o root -g root "$STACK_DIR/backups"

# The base file is two lines and owned by this script; the service
# definitions live in the overlays that CI uploads.
cat > "$STACK_DIR/docker-compose.yml" <<'EOF'
# /opt/7aylabs-site/docker-compose.yml: base file, written by
# scripts/bootstrap-host.sh. The services are defined in the overlays
# docker-compose.prod.yml and docker-compose.staging.yml, which every deploy
# uploads from the repository. Use scripts/site-deploy.sh to operate them.
name: 7aylabs-site
services: {}
EOF
chown "$DEPLOY_USER:$DEPLOY_USER" "$STACK_DIR/docker-compose.yml"
chmod 644 "$STACK_DIR/docker-compose.yml"
info "wrote docker-compose.yml"

# write_env <file> <origins> <label>
write_env() {
  local file="$1" origins="$2" label="$3" salt
  if [ -e "$file" ]; then
    info "kept existing $(basename "$file")"
  else
    salt="$(openssl rand -hex 32)"
    ( umask 077
      cat > "$file" <<EOF
# $file
# Runtime configuration for $label. Mode 600, never in git.
# After editing, recreate the container:
#   $STACK_DIR/scripts/site-deploy.sh compose <prod|staging> up -d --no-deps --force-recreate <service>

# Comma-separated origins allowed to POST to /api/*.
ALLOWED_ORIGINS=$origins

# Salts the hashed addresses stored with form submissions. Generated here;
# changing it resets rate-limit history.
RATE_LIMIT_SALT=$salt

SITE_DATA_DIR=/app/.data

# Optional: email a copy of each contact message through Resend.
# RESEND_API_KEY=
# CONTACT_NOTIFY_TO=
# CONTACT_FROM=

# The deploy workflow appends the image pin (SITE_IMAGE or
# SITE_STAGING_IMAGE) below after each release passes its smoke test.
EOF
    )
    info "created $(basename "$file") with a random RATE_LIMIT_SALT"
  fi
  chown "$DEPLOY_USER:$DEPLOY_USER" "$file"
  chmod 600 "$file"
}
write_env "$STACK_DIR/.env"         "https://7aylabs.com,https://www.7aylabs.com" "production (7aylabs.com)"
write_env "$STACK_DIR/.env.staging" "https://test.7aylabs.com"                    "staging (test.7aylabs.com)"

for f in docker-compose.prod.yml docker-compose.staging.yml; do
  src="$(find_asset "$f")"
  if [ -n "$src" ]; then
    install -m 644 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$src" "$STACK_DIR/$f"
    info "installed $f"
  else
    info "$f not found next to this script; the first deploy uploads it"
  fi
done
src="$(find_asset scripts/site-deploy.sh)"
if [ -n "$src" ]; then
  install -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$src" "$STACK_DIR/scripts/site-deploy.sh"
  info "installed scripts/site-deploy.sh"
else
  info "site-deploy.sh not found next to this script; the first deploy uploads it"
fi

# ── 10. nginx ────────────────────────────────────────────────────────────
step "nginx (127.0.0.1:8080)"
NGX_HTTP="$(find_asset docs/ops/nginx/00-site-7aylabs-http.conf)"
NGX_PROXY="$(find_asset docs/ops/nginx/site-7aylabs-proxy.conf)"
NGX_SITE="$(find_asset docs/ops/nginx/site-7aylabs.conf)"
[ -n "$NGX_HTTP" ] || NGX_HTTP="$(find_asset nginx/00-site-7aylabs-http.conf)"
[ -n "$NGX_PROXY" ] || NGX_PROXY="$(find_asset nginx/site-7aylabs-proxy.conf)"
[ -n "$NGX_SITE" ] || NGX_SITE="$(find_asset nginx/site-7aylabs.conf)"
if [ -z "$NGX_HTTP" ] || [ -z "$NGX_PROXY" ] || [ -z "$NGX_SITE" ]; then
  die "nginx config files not found. Copy docs/ops/nginx/*.conf next to this script (or run it from a checkout)."
fi

# The packaged default site listens on 0.0.0.0:80. On a first install the
# unit is masked while the package is unpacked, so nginx is not started
# until that site has been removed and nothing ever binds a public port
# (ufw would block it anyway).
NGINX_WAS_INSTALLED=1
dpkg -s nginx >/dev/null 2>&1 || NGINX_WAS_INSTALLED=0
if [ "$NGINX_WAS_INSTALLED" -eq 0 ]; then
  systemctl mask nginx.service >/dev/null 2>&1 || true
fi
apt_install nginx
if [ "$NGINX_WAS_INSTALLED" -eq 0 ]; then
  systemctl unmask nginx.service >/dev/null 2>&1 || true
fi
rm -f /etc/nginx/sites-enabled/default
install -d -m 755 /etc/nginx/sites-enabled /etc/nginx/sites-available /etc/nginx/conf.d /etc/nginx/snippets

install -m 644 "$NGX_HTTP"  /etc/nginx/conf.d/00-site-7aylabs-http.conf
install -m 644 "$NGX_PROXY" /etc/nginx/snippets/site-7aylabs-proxy.conf
install -m 644 "$NGX_SITE"  /etc/nginx/sites-available/site-7aylabs.conf
ln -sfn /etc/nginx/sites-available/site-7aylabs.conf /etc/nginx/sites-enabled/site-7aylabs.conf

nginx -t 2>/dev/null || { nginx -t || true; die "nginx rejected the configuration (see above)"; }
systemctl enable nginx >/dev/null 2>&1
if [ "$NGINX_WAS_INSTALLED" -eq 0 ]; then
  systemctl restart nginx
else
  systemctl reload nginx || systemctl restart nginx
fi
if ss -H -ltn | grep -E ':(80|443)\s' | grep -qv '127\.0\.0\.1'; then
  warn "something listens on port 80 or 443 on a public address; check 'ss -ltnp'"
fi
info "serving 7aylabs.com, www.7aylabs.com and test.7aylabs.com on loopback"

# ── 11. cloudflared ──────────────────────────────────────────────────────
step "cloudflared"
install -d -m 755 /usr/share/keyrings
if [ ! -s /usr/share/keyrings/cloudflare-public-v2.gpg ]; then
  curl -fsSL https://pkg.cloudflare.com/cloudflare-public-v2.gpg -o /usr/share/keyrings/cloudflare-public-v2.gpg
  chmod a+r /usr/share/keyrings/cloudflare-public-v2.gpg
fi
CF_LIST="deb [signed-by=/usr/share/keyrings/cloudflare-public-v2.gpg] https://pkg.cloudflare.com/cloudflared any main"
if [ "$(cat /etc/apt/sources.list.d/cloudflared.list 2>/dev/null || true)" != "$CF_LIST" ]; then
  echo "$CF_LIST" > /etc/apt/sources.list.d/cloudflared.list
  apt-get "${APT_WAIT[@]}" update -qq
fi
apt_install cloudflared
CLOUDFLARED_BIN="$(command -v cloudflared)"
info "$("$CLOUDFLARED_BIN" --version 2>/dev/null | head -n 1)"

if ! id cloudflared >/dev/null 2>&1; then
  adduser --system --group --no-create-home --home /nonexistent --shell /usr/sbin/nologin cloudflared >/dev/null
fi
install -d -m 750 -o root -g cloudflared /etc/cloudflared

# Ingress rules. A tunnel created with the cloudflared CLI takes its routes
# from this file, not from the dashboard: every hostname goes to nginx on
# loopback, which picks the site by Host header. Anything else gets a 404.
# The file holds no secret; it is group-readable so the service user can
# read it.
cat > /etc/cloudflared/config.yml <<'CFEOF'
# Managed by scripts/bootstrap-host.sh
ingress:
  - hostname: 7aylabs.com
    service: http://127.0.0.1:8080
  - hostname: www.7aylabs.com
    service: http://127.0.0.1:8080
  - hostname: test.7aylabs.com
    service: http://127.0.0.1:8080
  - service: http_status:404
CFEOF
chown root:cloudflared /etc/cloudflared/config.yml
chmod 640 /etc/cloudflared/config.yml

# The token never goes on a command line or into the unit file (both are
# readable by any local user). It is written to a root-only file that
# systemd reads as an environment file. It is never printed.
if [ -z "$CF_TUNNEL_TOKEN" ] && [ -n "$CF_TUNNEL_TOKEN_FILE" ]; then
  [ -r "$CF_TUNNEL_TOKEN_FILE" ] || die "CF_TUNNEL_TOKEN_FILE is not readable"
  CF_TUNNEL_TOKEN="$(tr -d ' \t\r\n' < "$CF_TUNNEL_TOKEN_FILE")"
fi
TOKEN_ENV="/etc/cloudflared/tunnel.env"
if [ -n "$CF_TUNNEL_TOKEN" ]; then
  if ! printf '%s' "$CF_TUNNEL_TOKEN" | grep -qE '^[A-Za-z0-9_=+/-]{40,}$'; then
    die "the tunnel token does not look like a token (value not shown)"
  fi
  ( umask 077; printf 'TUNNEL_TOKEN=%s\n' "$CF_TUNNEL_TOKEN" > "$TOKEN_ENV" )
  chown root:root "$TOKEN_ENV"
  chmod 600 "$TOKEN_ENV"
  info "stored the tunnel token in $TOKEN_ENV (root only)"
fi
unset CF_TUNNEL_TOKEN

cat > /etc/systemd/system/cloudflared.service <<EOF
# Managed by scripts/bootstrap-host.sh
[Unit]
Description=Cloudflare Tunnel for 7aylabs.com
After=network-online.target nginx.service
Wants=network-online.target

[Service]
Type=notify
User=cloudflared
Group=cloudflared
EnvironmentFile=${TOKEN_ENV}
ExecStart=${CLOUDFLARED_BIN} --no-autoupdate --config /etc/cloudflared/config.yml tunnel run
Restart=on-failure
RestartSec=5s
TimeoutStartSec=0
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectKernelTunables=true
ProtectControlGroups=true
RestrictSUIDSGID=true
CapabilityBoundingSet=
AmbientCapabilities=

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
TUNNEL_STATE="not registered (no token given)"
if [ -s "$TOKEN_ENV" ]; then
  systemctl enable cloudflared >/dev/null 2>&1
  systemctl restart cloudflared
  sleep 3
  if systemctl is-active --quiet cloudflared; then
    TUNNEL_STATE="running"
  else
    TUNNEL_STATE="FAILED to start: journalctl -u cloudflared -n 50"
  fi
fi
info "tunnel service: $TUNNEL_STATE"

# ── 12. Database backups ─────────────────────────────────────────────────
step "Database backups"
BACKUP_SRC="$(find_asset scripts/db-backup.sh)"
if [ -n "$BACKUP_SRC" ]; then
  install -m 755 -o root -g root "$BACKUP_SRC" "$BACKUP_BIN"
  info "installed $BACKUP_BIN"
elif [ -x "$BACKUP_BIN" ]; then
  info "kept existing $BACKUP_BIN (db-backup.sh not found next to this script)"
else
  die "db-backup.sh not found. Copy scripts/db-backup.sh next to this script."
fi

cat > /etc/systemd/system/site-db-backup.service <<EOF
# Managed by scripts/bootstrap-host.sh
[Unit]
Description=Verified backup of the 7aylabs.com SQLite databases
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
ExecStart=${BACKUP_BIN}
Nice=10
EOF
cat > /etc/systemd/system/site-db-backup.timer <<'EOF'
# Managed by scripts/bootstrap-host.sh
[Unit]
Description=Daily backup of the 7aylabs.com SQLite databases

[Timer]
OnCalendar=*-*-* 03:40:00 UTC
RandomizedDelaySec=10m
Persistent=true

[Install]
WantedBy=timers.target
EOF
systemctl daemon-reload
systemctl enable --now site-db-backup.timer >/dev/null 2>&1

# The "DB backup" workflow connects as `deploy`, which cannot read the
# Docker volume directories. This lets it run exactly one root-owned
# program, which `deploy` cannot modify.
printf '%s ALL=(root) NOPASSWD: %s\n' "$DEPLOY_USER" "$BACKUP_BIN" > /etc/sudoers.d/91-site-db-backup.tmp
visudo -cf /etc/sudoers.d/91-site-db-backup.tmp >/dev/null || die "sudoers entry for the backup failed validation"
chmod 440 /etc/sudoers.d/91-site-db-backup.tmp
mv /etc/sudoers.d/91-site-db-backup.tmp /etc/sudoers.d/91-site-db-backup
info "timer enabled (daily, about 03:40 UTC); $DEPLOY_USER may run the backup through sudo"

# ── Checklist ────────────────────────────────────────────────────────────
HOST_FP="$(ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub 2>/dev/null | awk '{print $2}' || true)"
cat <<EOF

────────────────────────────────────────────────────────────────────────
 Host is ready. What is left (details in docs/ops/runbook.md):

 1. From your own machine, BEFORE closing this session, check you can
    still get in:
        ssh -p ${SSH_PORT} ${DEPLOY_USER}@<this host>
    Root login over SSH is now off. Administration is through
    ${ADMIN_USER:-the provider web console (no ADMIN_USER was set)}.

 2. GitHub repository secrets:
        VPS_HOST          this machine's address
        VPS_USER          ${DEPLOY_USER}
        VPS_PORT          ${SSH_PORT}
        VPS_SSH_KEY       the private half of the deploy key
        VPS_KNOWN_HOSTS   output of, from your machine:
                            ssh-keyscan -p ${SSH_PORT} -t ed25519 <this host>
                          Its fingerprint must match this host key:
                            ${HOST_FP:-<run: ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub>}

 3. Cloudflare Tunnel: ${TUNNEL_STATE}
    In the Zero Trust dashboard give the tunnel three public hostnames,
    each pointing at  http://127.0.0.1:8080 :
        7aylabs.com    www.7aylabs.com    test.7aylabs.com
    To add the token later, re-run this script with CF_TUNNEL_TOKEN_FILE.

 4. Review ${STACK_DIR}/.env and ${STACK_DIR}/.env.staging
    (optional mail settings; RATE_LIMIT_SALT is already set).

 5. Make the GHCR package public (or 'docker login ghcr.io' as
    ${DEPLOY_USER} with a read-only token), then deploy:
        staging:    gh workflow run deploy.yml --ref testing
        production: merge to main

 6. In the provider firewall, allow inbound ${SSH_PORT}/tcp only.
────────────────────────────────────────────────────────────────────────
EOF
