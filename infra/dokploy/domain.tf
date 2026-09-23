# Le Traefik de Dokploy termine TLS (Let's Encrypt) et route vers le service
# compose nommé. Les enregistrements DNS sont dans ../terraform/dns.tf.
#
# Piège connu : au tout premier apply d'un environnement, les domaines sont
# créés APRÈS le déploiement du compose → conteneurs sans labels Traefik → 404.
# Redéployer une fois (relancer le workflow) règle le problème.

locals {
  routes = {
    app   = { port = 3000, host = local.domains.site }
    minio = { port = 9000, host = local.domains.media }
  }
}

resource "dokploy_domain" "jemima" {
  for_each = local.routes

  compose_id       = dokploy_compose.jemima.id
  service_name     = each.key
  host             = each.value.host
  port             = each.value.port
  https            = true
  certificate_type = "letsencrypt"
}
