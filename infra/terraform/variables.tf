variable "cf_api_token" {
  type        = string
  description = "Token Cloudflare avec droits DNS sur la zone koklo.dev"
  sensitive   = true
}

variable "cf_zone_id" {
  type        = string
  description = "Zone id Cloudflare de koklo.dev"
}

variable "vps20_ip" {
  type        = string
  description = "IPv4 publique du VPS20 (Dokploy)"
}

# Non proxifié tant que Dokploy obtient les certificats Let's Encrypt (HTTP-01) :
# un enregistrement orange sans certificat d'origine répond 526.
# Passer à true une fois tous les hôtes servis en HTTPS.
variable "cloudflare_proxied" {
  type    = bool
  default = false
}
