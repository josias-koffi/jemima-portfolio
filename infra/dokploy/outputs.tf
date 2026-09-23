output "environment" {
  value = var.environment
}

output "project_id" {
  value = dokploy_project.jemima.id
}

output "compose_id" {
  description = "Id du service compose (import / UI Dokploy)"
  value       = dokploy_compose.jemima.id
}

output "compose_status" {
  value = dokploy_compose.jemima.status
}

output "urls" {
  value = {
    site  = "https://${local.domains.site}"
    admin = "https://${local.domains.site}/admin"
    media = "https://${local.domains.media}"
  }
}
