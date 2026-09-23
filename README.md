# Portfolio Jémima Egla

Site + admin **Payload CMS 3** (Next.js 16), médias dans **MinIO**, déployé sur le VPS Koklo via **Dokploy** (même pattern que cvforge).
Le visuel est repris à l'identique de l'ancien site Jekyll (`src/app/(site)/main.css`, CSS pur, aucun JavaScript maison).

| | Prod (`main`) | Staging (`develop`) |
|---|---|---|
| Site | https://jemima.koklo.dev | https://jemima-staging.koklo.dev |
| Admin | https://jemima.koklo.dev/admin | https://jemima-staging.koklo.dev/admin |
| Médias | https://jemima-media.koklo.dev | https://jemima-media-staging.koklo.dev |

## Gérer le contenu (admin)

- **Projets** : titre, position dans la liste, client, année, accroche, rôle, expertises, couverture, texte, galerie, liens.
  Un projet est un **brouillon** tant qu'il n'est pas publié ; la publication est visible immédiatement.
- **Texte d'un projet** : bouton « + » ou « / » pour insérer entre deux paragraphes une **image / vidéo** de la médiathèque
  (option « lecture en boucle ») ou une **vidéo YouTube**.
- **Profil & accueil** : hero (nom, accroche avec mots en gras, photo, bandeau), À propos, contact, image de partage.
- **Médiathèque** : images et vidéos MP4/WebM (200 Mo max) ; les images sont redimensionnées en WebP automatiquement.

## Développement local

```bash
cp .env.example .env            # puis compléter (valeurs de dev : voir .env.example)
docker compose up -d            # Postgres (5435) + MinIO (9100, console 9101) + bucket public
pnpm install
pnpm dev                        # http://localhost:3000 — admin : /admin (compte ADMIN_EMAIL/ADMIN_PASSWORD)
```

Importer le contenu de l'ancien site (dossier `seed/`), une fois connecté :

```bash
TOKEN=$(curl -s -X POST localhost:3000/api/users/login -H 'Content-Type: application/json' \
  -d '{"email":"…","password":"…"}' | jq -r .token)
curl -X POST localhost:3000/api/import-jekyll -H "Authorization: JWT $TOKEN"
```

En staging/prod : **Actions › Import content › Run workflow** (choisir l'environnement).
L'import est idempotent (projets existants ignorés ; profil rempli seulement s'il est vide, `?force=1` pour l'écraser).

## Modifier le modèle de données

Toute modification d'une collection / d'un global exige une migration :

```bash
pnpm payload migrate:create nom-du-changement   # génère src/migrations/…
pnpm payload migrate                             # applique en local
pnpm generate:types && pnpm generate:importmap
```

En production, les migrations s'appliquent au démarrage du conteneur (`prodMigrations`).

## Qualité

```bash
pnpm lint && pnpm exec tsc --noEmit && pnpm test:int
PW_CHANNEL=chrome pnpm test:e2e     # smoke test du site (serveur local + contenu importé)
```

## Déploiement

Push sur `develop` → staging, merge dans `main` → production. Détails, secrets et pièges : [docs/deploy.md](docs/deploy.md).
