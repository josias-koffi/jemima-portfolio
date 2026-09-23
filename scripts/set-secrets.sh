#!/usr/bin/env bash
# Remplit les secrets GitHub dont le workflow Deploy a besoin (pattern cvforge).
#
#   bash scripts/set-secrets.sh            # interactif
#   bash scripts/set-secrets.sh --auto     # sans terminal : seulement ce qui se déduit
#
# - VPS20_IP, CF_API_TOKEN, CF_ZONE_ID : lus dans koklo-infra/.env
# - SMTP_USER / SMTP_PASSWORD : même compte Resend que cvforge (.env.prod)
# - DOKPLOY_API_KEY, R2_* : demandés (masqués)
# - Mots de passe Postgres / MinIO / PAYLOAD_SECRET : générés, un jeu par environnement
# - ADMIN_EMAIL / ADMIN_PASSWORD : premier compte admin de chaque environnement
#
# Aucune valeur n'est affichée ni écrite sur disque. Relancer est sans danger :
# Entrée vide = on garde la valeur déjà enregistrée. ATTENTION : régénérer
# POSTGRES_PASSWORD / MINIO_* après le premier déploiement coupe l'accès aux
# volumes existants — ces secrets ne sont générés que s'ils n'existent pas encore.

set -uo pipefail

AUTO=0
[ "${1:-}" = "--auto" ] && AUTO=1

REPO="josias-koffi/jemima-portfolio"
KOKLO_ENV_FILE="${KOKLO_ENV_FILE:-$HOME/perso/projets/koklo/koklo-infra/.env}"
CVFORGE_ENV_PROD="${CVFORGE_ENV_PROD:-$HOME/perso/projets/cvforge/.env.prod}"

ok=0
skipped=0

set_secret() {            # nom, valeur, [env]
  local name="$1" value="$2" env="${3:-}"
  if [ -z "$value" ]; then
    printf '  · %-22s %-11s ignoré\n' "$name" "${env:-dépôt}"
    skipped=$((skipped + 1))
    return
  fi
  # Pas de --body : la valeur passe par stdin, jamais dans la liste des processus.
  if [ -n "$env" ]; then
    printf '%s' "$value" | gh secret set "$name" --repo "$REPO" --env "$env" >/dev/null
  else
    printf '%s' "$value" | gh secret set "$name" --repo "$REPO" >/dev/null
  fi
  printf '  ✓ %-22s %-11s défini\n' "$name" "${env:-dépôt}"
  ok=$((ok + 1))
}

exists() {                # nom, [env] → 0 si le secret existe déjà
  local name="$1" env="${2:-}"
  if [ -n "$env" ]; then
    gh secret list --repo "$REPO" --env "$env" --json name --jq '.[].name' 2>/dev/null | grep -qx "$name"
  else
    gh secret list --repo "$REPO" --json name --jq '.[].name' 2>/dev/null | grep -qx "$name"
  fi
}

read_hidden() {
  local prompt="$1" value=""
  [ "$AUTO" = "1" ] && return 0
  read -rsp "  $prompt : " value </dev/tty
  printf '\n' >&2
  printf '%s' "$value"
}

read_visible() {
  local prompt="$1" value=""
  [ "$AUTO" = "1" ] && return 0
  read -rp "  $prompt : " value </dev/tty
  printf '%s' "$value"
}

from_file() {             # fichier, clé
  [ -f "$1" ] || return 0
  sed -n "s/^$2=//p" "$1" | head -1 | sed -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/"
}

gen() { openssl rand -hex 24; }

echo
echo "Dépôt : $REPO"
echo
echo "1/3  Secrets de dépôt (partagés staging / production)"
for name in VPS20_IP CF_API_TOKEN CF_ZONE_ID; do
  set_secret "$name" "$(from_file "$KOKLO_ENV_FILE" "$name")"
done
for name in DOKPLOY_API_KEY R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_ENDPOINT; do
  if exists "$name"; then printf '  = %-22s %-11s déjà présent\n' "$name" dépôt; continue; fi
  case "$name" in
    DOKPLOY_API_KEY) echo "     (même clé que cvforge : Dokploy › Settings › Profile › API/CLI Keys, rate limiting DÉSACTIVÉ)" ;;
    R2_ENDPOINT)     echo "     (https://<account-id>.r2.cloudflarestorage.com)" ;;
    R2_*)            echo "     (token R2 du bucket koklo-tofu-state, comme cvforge)" ;;
  esac
  set_secret "$name" "$(read_hidden "$name")"
done

smtp_user="$(from_file "$CVFORGE_ENV_PROD" SMTP_USER)"
smtp_password="$(from_file "$CVFORGE_ENV_PROD" SMTP_PASSWORD)"

for env in staging production; do
  echo
  [ "$env" = staging ] && echo "2/3  Environnement staging" || echo "3/3  Environnement production"
  for name in POSTGRES_PASSWORD PAYLOAD_SECRET MINIO_SECRET_KEY; do
    if exists "$name" "$env"; then printf '  = %-22s %-11s déjà présent (conservé)\n' "$name" "$env"; continue; fi
    set_secret "$name" "$(gen)" "$env"
  done
  if exists MINIO_ACCESS_KEY "$env"; then printf '  = %-22s %-11s déjà présent (conservé)\n' MINIO_ACCESS_KEY "$env"
  else set_secret MINIO_ACCESS_KEY "$([ "$env" = production ] && echo jemima || echo jemima-staging)" "$env"; fi

  set_secret SMTP_USER "$smtp_user" "$env"
  set_secret SMTP_PASSWORD "$smtp_password" "$env"

  if exists ADMIN_EMAIL "$env"; then
    printf '  = %-22s %-11s déjà présent\n' ADMIN_EMAIL "$env"
  else
    echo "     Premier compte admin $env (vous créerez ensuite celui de Jémima dans l'admin)."
    set_secret ADMIN_EMAIL "$(read_visible "ADMIN_EMAIL ($env)")" "$env"
    set_secret ADMIN_PASSWORD "$(read_hidden "ADMIN_PASSWORD ($env, 12 caractères min.)")" "$env"
  fi
done

echo
echo "$ok définis, $skipped ignorés."
echo "Vérification :"
echo "  gh secret list --repo $REPO"
echo "  gh secret list --repo $REPO --env staging"
echo "  gh secret list --repo $REPO --env production"
