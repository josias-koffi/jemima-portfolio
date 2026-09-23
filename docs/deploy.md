# Déploiement

Pattern identique à cvforge : image GHCR → OpenTofu (DNS Cloudflare + Dokploy) → smoke test + vérification de version.

## Chaîne (`.github/workflows/deploy.yml`)

1. **resolve** — `develop` → staging, `main` → production ; `workflow_dispatch` pour redéployer / revenir à un tag (sha court).
2. **build** — `ghcr.io/josias-koffi/jemima-portfolio:<sha>` (+ `develop` / `main` / `latest`).
3. **verify-image** — démarre l'image contre un Postgres jetable : migrations au boot, `/api/health`, `/`, `/admin/login`.
4. **tofu (DNS)** — `infra/terraform` : 4 enregistrements A vers VPS20 (state `jemima/terraform.tfstate`).
5. **deploy** — `infra/dokploy` : projet + compose + 2 domaines Let's Encrypt (state `jemima/dokploy-<env>.tfstate`), puis smoke test et contrôle que `/version` renvoie bien le sha déployé.

## Stack (`infra/compose/dokploy-stack.yml`)

`app` (Next/Payload, :3000) · `postgres` 16 · `minio` (public sur le domaine média, bucket `media` en lecture anonyme) ·
`minio-init` (crée le bucket à chaque déploiement) · `db_backup` (pg_dump quotidien dans le volume `<projet>_db_backups`).

## Premier déploiement (bootstrap)

1. **Secrets** : `bash scripts/set-secrets.sh` (dépôt + environnements staging/production).
   La clé Dokploy doit avoir **Enable Rate Limiting désactivé** (sinon 401 pendant 24 h).
2. **Push `develop`** → staging. Au tout premier apply, les domaines sont créés après le compose :
   le site répond 404 ; le workflow le détecte et redemande un déploiement à Dokploy (étape « Redeploy if the routes are missing »).
3. **Import du contenu** : Actions › **Import content** › Run workflow (environnement voulu).
4. Créer le compte de Jémima dans *Réglages › Utilisateurs*.
5. **Prod** : merge `develop` → `main`, puis étapes 3-4 sur la prod.

## Pièges connus (hérités de cvforge)

- **Dépôt public obligatoire** (plan GitHub gratuit) : les secrets d'environnement et les restrictions de branche
  n'existent pas sur un dépôt privé gratuit, et l'image GHCR publique permet à Dokploy de la tirer sans identifiants.

- **OpenTofu possède le stack** : toute modification faite dans l'UI Dokploy est écrasée au prochain apply.
- **Réseau partagé `dokploy-network`** : staging et prod publient les mêmes noms de services (`postgres`, `minio`).
  L'app n'utilise que les alias uniques `<projet>-postgres` / `<projet>-minio`. Ne jamais référencer un nom nu.
- **DNS non proxifié** au départ (`cloudflare_proxied = false`) pour que Let's Encrypt (HTTP-01) émette les certificats.
- **Secrets dans le state** : `dokploy_compose.env` n'est pas marqué sensible → le bucket R2 doit rester privé.
- **Ne pas régénérer** `POSTGRES_PASSWORD` / `MINIO_*` après le premier déploiement : les volumes gardent l'ancien mot de passe.
- **Images MinIO** : plus publiées sur Docker Hub → `quay.io/minio/*` avec tag épinglé.
- **Sauvegardes** : Postgres sur le VPS uniquement ; MinIO non sauvegardé (à ajouter : `mc mirror` vers un stockage externe).
