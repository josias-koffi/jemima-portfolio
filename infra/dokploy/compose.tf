# ==============================================================================
# OPENTOFU POSSÈDE CE SERVICE. Tout changement fait dans l'UI Dokploy (compose,
# variables, réglages) est écrasé silencieusement au prochain apply.
# ==============================================================================

resource "dokploy_compose" "jemima" {
  name           = local.project_name
  description    = "Portfolio Jémima ${var.environment} — géré par OpenTofu"
  environment_id = dokploy_project.jemima.production_environment_id
  compose_type   = "docker-compose"

  # Envoyé inline : Dokploy ne clone rien, pas de GitHub App à enregistrer.
  raw = {
    compose_file = file("${path.module}/../compose/dokploy-stack.yml")
  }

  # Devient le .env du projet compose (les ${...} de dokploy-stack.yml).
  # Attention : non marqué sensible par le provider → secrets présents dans le
  # state R2 (bucket privé).
  env = join("\n", [
    "IMAGE_TAG=${var.image_tag}",
    "APP_VERSION=${var.image_tag}",
    "PROJECT=${local.project_name}",
    "VOLUME_PREFIX=${local.volume_prefix}",
    "SITE_ENV=${var.environment}",
    "SITE_DOMAIN=${local.domains.site}",
    "MEDIA_DOMAIN=${local.domains.media}",
    "POSTGRES_DB=${var.postgres_db}",
    "POSTGRES_USER=${var.postgres_user}",
    "POSTGRES_PASSWORD=${var.postgres_password}",
    "PAYLOAD_SECRET=${var.payload_secret}",
    "MINIO_ACCESS_KEY=${var.minio_access_key}",
    "MINIO_SECRET_KEY=${var.minio_secret_key}",
    "ADMIN_EMAIL=${var.admin_email}",
    "ADMIN_PASSWORD=${var.admin_password}",
    "SMTP_HOST=${var.smtp_host}",
    "SMTP_PORT=${var.smtp_port}",
    "SMTP_USER=${var.smtp_user}",
    "SMTP_PASSWORD=${var.smtp_password}",
    "EMAIL_FROM=${local.email_from}",
  ])
}
