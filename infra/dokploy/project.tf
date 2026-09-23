# Un projet par environnement. Dokploy crée l'environnement par défaut
# `production` avec le projet : les services utilisent production_environment_id
# (ne pas le dériver de la liste `environments`, cela force des remplacements).
resource "dokploy_project" "jemima" {
  name        = local.project_name
  description = "Portfolio Jémima ${var.environment} — géré par OpenTofu (infra/dokploy). Ne pas modifier dans l'UI Dokploy."
}
