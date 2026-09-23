terraform {
  required_version = ">= 1.10.0"

  required_providers {
    dokploy = {
      source  = "vanillauys/dokploy"
      version = "~> 1.0"
    }
  }

  # Même bucket R2 que cvforge, un state par environnement : un apply staging ne
  # peut jamais toucher la prod. La `key` est fournie à l'init :
  #
  #   tofu init -backend-config="key=jemima/dokploy-production.tfstate"
  #   tofu init -backend-config="key=jemima/dokploy-staging.tfstate"
  #
  # Endpoint via AWS_ENDPOINT_URL_S3, identifiants via AWS_ACCESS_KEY_ID /
  # AWS_SECRET_ACCESS_KEY (token R2).
  backend "s3" {
    bucket = "koklo-tofu-state"
    region = "auto"

    use_path_style              = true
    use_lockfile                = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
  }
}

provider "dokploy" {
  endpoint = var.dokploy_endpoint
  insecure = var.dokploy_insecure
  # api_key volontairement absent : lu dans DOKPLOY_API_KEY.
}

locals {
  is_production = var.environment == "production"

  # Un projet Dokploy par environnement ; sert aussi de préfixe des alias réseau
  # uniques (<project>-postgres, <project>-minio) et des volumes.
  project_name  = local.is_production ? "jemima" : "jemima-staging"
  volume_prefix = local.project_name

  domains = local.is_production ? {
    site  = "jemima.koklo.dev"
    media = "jemima-media.koklo.dev"
    } : {
    site  = "jemima-staging.koklo.dev"
    media = "jemima-media-staging.koklo.dev"
  }

  email_from = local.is_production ? var.email_from : "Portfolio Jémima (staging) <no-reply@koklo.dev>"
}
