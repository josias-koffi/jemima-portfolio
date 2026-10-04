# Déploiement

Jemima est déployée par la plateforme [josias-koffi/infra](https://github.com/josias-koffi/infra) :
le repo ne contient que [`.deploy/manifest.yaml`](../.deploy/manifest.yaml) et le workflow
[`deploy-platform.yml`](../.github/workflows/deploy-platform.yml). Projet Dokploy `jemima`,
environnements `staging` et `production`.

## Chaîne

Les règles de déclenchement sont dans le manifest (`environments.<env>.branch` et
`deploy: auto|manual`), pas dans le workflow.

| Déclencheur | Effet |
|---|---|
| push sur `develop` | build de l'image (`sha` court) → démarrage de vérification contre un Postgres jetable → déploiement **staging** |
| push sur `main` | rien : la production est en `deploy: manual` |
| *Actions → Deploy → Run workflow* depuis `main` | déploiement **production** (refusé depuis une autre branche) |
| idem avec `image_tag` | redéploie un tag existant : promotion du tag validé en staging, ou rollback |
| idem avec `plan_only` | affiche le plan sans rien appliquer |

Pour mettre en prod ce qui tourne en staging : merge `develop` → `main`, puis *Run workflow* sur
`main` avec `image_tag` = le tag du staging (pas de rebuild).

Secrets : ceux listés dans le manifest, dans les environnements GitHub `staging` et `production`.
Variables du repo : `DOKPLOY_URL`, `TF_STATE_BUCKET`. Secrets du repo : `DOKPLOY_API_KEY`, `R2_*`.

Le DNS (`jemima[-media][-staging].koklo.dev`) reste géré par [`infra/terraform`](../infra/terraform)
(`dns: external` dans le manifest).

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
- **La plateforme possède le stack** : toute modification faite dans l'UI Dokploy est écrasée au prochain déploiement.
- **Réseau partagé `dokploy-network`** : staging et prod publient les mêmes noms de services (`postgres`, `minio`).
  L'app n'utilise que les alias uniques `<projet>-postgres` / `<projet>-minio`. Ne jamais référencer un nom nu.
- **DNS non proxifié** au départ (`cloudflare_proxied = false`) pour que Let's Encrypt (HTTP-01) émette les certificats.
- **Secrets dans le state** : l'env du compose est dans le state OpenTofu → le bucket R2 doit rester privé.
- **Ne pas régénérer** `POSTGRES_PASSWORD` / `MINIO_*` après le premier déploiement : les volumes gardent l'ancien mot de passe.
- **Images MinIO** : plus publiées sur Docker Hub → `quay.io/minio/*` avec tag épinglé.
- **Sauvegardes** : Postgres et le volume MinIO sont sauvegardés chaque nuit vers R2 par Dokploy (3h / 4h, 35 jours en prod,
  7 en staging), en plus du `db_backup` local.
