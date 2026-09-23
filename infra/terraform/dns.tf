# Sous-domaines « plats » de koklo.dev : l'Universal SSL de Cloudflare ne couvre
# pas *.x.koklo.dev.
locals {
  records = {
    site          = "jemima"
    media         = "jemima-media"
    site_staging  = "jemima-staging"
    media_staging = "jemima-media-staging"
  }
}

resource "cloudflare_record" "jemima" {
  for_each = local.records

  zone_id = var.cf_zone_id
  name    = each.value
  type    = "A"
  content = var.vps20_ip
  proxied = var.cloudflare_proxied
}
