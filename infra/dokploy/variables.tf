# Cible -----------------------------------------------------------------------

variable "environment" {
  type        = string
  description = "Environnement géré par ce state ; tout le reste en découle (main.tf)."

  validation {
    condition     = contains(["production", "staging"], var.environment)
    error_message = "environment doit valoir \"production\" ou \"staging\"."
  }
}

# Connexion -------------------------------------------------------------------

variable "dokploy_endpoint" {
  type        = string
  description = "URL du serveur Dokploy (VPS20)"
  default     = "https://dokploy.ops.koklo.dev"
}

variable "dokploy_insecure" {
  type        = bool
  description = "Ignorer la vérification TLS (certificat auto-signé uniquement)"
  default     = false
}

# Release ---------------------------------------------------------------------

variable "image_tag" {
  type        = string
  description = "Tag de ghcr.io/josias-koffi/jemima-portfolio (sha court, passé par la CI)"
  default     = "latest"
}

# Réglages non secrets --------------------------------------------------------

variable "postgres_db" {
  type    = string
  default = "jemima"
}

variable "postgres_user" {
  type    = string
  default = "jemima"
}

variable "smtp_host" {
  type        = string
  description = "Serveur SMTP. Vide = pas d'e-mails (les liens « mot de passe oublié » vont dans les logs)."
  default     = "smtp.resend.com"
}

variable "smtp_port" {
  type    = number
  default = 587
}

variable "email_from" {
  type    = string
  default = "Portfolio Jémima <no-reply@koklo.dev>"
}

# Secrets (TF_VAR_* depuis les secrets de l'environnement GitHub) --------------

variable "postgres_password" {
  type      = string
  sensitive = true
}

variable "payload_secret" {
  type      = string
  sensitive = true
}

variable "minio_access_key" {
  type      = string
  sensitive = true
}

variable "minio_secret_key" {
  type      = string
  sensitive = true
}

variable "admin_email" {
  type        = string
  description = "Premier compte admin, créé seulement si la base n'a aucun utilisateur"
  sensitive   = true
}

variable "admin_password" {
  type      = string
  sensitive = true
}

variable "smtp_user" {
  type      = string
  sensitive = true
  default   = ""
}

variable "smtp_password" {
  type      = string
  sensitive = true
  default   = ""
}
