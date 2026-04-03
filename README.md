# GestPharmacieApi_express_221

Base d'API Express + TypeScript + Prisma pour une application de gestion de pharmacie.

## Architecture

```text
pharma-221/
├── .github/workflows/ci.yml
├── docker/
├── prisma/
├── render.yaml
├── src/
│   ├── config/
│   ├── common/
│   │   ├── constants/
│   │   ├── enums/
│   │   ├── errors/
│   │   ├── interfaces/
│   │   ├── messages/
│   │   ├── types/
│   │   └── utils/
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── external/
│   │   └── repositories/
│   ├── container/
│   ├── middlewares/
│   ├── modules/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

## Démarrage

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

## Swagger

Documentation interactive disponible sur:

- local: `http://localhost:4000/docs`
- OpenAPI JSON: `http://localhost:4000/docs/openapi.json`
- production: `https://pharmacie-221.onrender.com/docs`

## Progression des sprints

- `Sprint 1` : modele Prisma aligne au sujet.
- `Sprint 2` : CRUD fournisseurs + suppression protegee.
- `Sprint 3` : CRUD medicaments + validations metier.
- `Sprint 4` : CRUD clients + suppression protegee.
- `Sprint 5` : ventes avec verification client, medicament, expiration, stock, calcul du montant et decrement du stock.

## Stratégie Git

- `main` : branche de référence, pas de développement direct.
- `prod` : branche des versions stables prêtes pour la mise en production.
- `dev` : branche d'intégration pour le développement courant.
- `feature/*` : une branche par fonctionnalité, créée depuis `dev`.

Exemple de flux:

```bash
git checkout dev
git checkout -b feature/gestion-clients
```

## Workflow Kilo -> Codex

Si `Kilo Code` implemente une fonctionnalite, `Codex` peut passer ensuite comme ingenieur qualite final.

Principe:

- `Kilo Code` code la fonctionnalite dans sa branche ou son worktree.
- `Codex` seul garde l'acces au MCP `Neon`.
- `Codex` relit, teste, corrige et aligne les changements sur les conventions du repo.

Commande:

```bash
npm run agent:codex-guard
```

Mode local uniquement:

```bash
npm run agent:codex-guard:local
```

Avec une base explicite:

```bash
bash scripts/codex-guard.sh dev
```

Ce script demande a `Codex` de:

- comparer la branche courante a `dev`
- lancer les controles utiles
- corriger les ecarts de qualite ou de coherence
- conserver l'intention fonctionnelle de depart

Comportement de secours:

- si `Codex` distant est inaccessible, le script bascule sur des controles locaux
- l'etat runtime de `Codex` est redirige vers `.kilo/codex-home/` pour eviter les erreurs de permissions

## Deploiement Render

Le repo contient un blueprint [render.yaml](./render.yaml) pour un deploiement simple sur `Render`.

Configuration retenue:

- service web Node branche `prod`
- deploiement declenche par GitHub Actions apres succes de la CI sur `prod`
- base Postgres Render referencee automatiquement dans `DATABASE_URL`
- health check sur `/api/v1/health`

Commandes utilisees:

```bash
Build: npm ci --include=dev && npm run prisma:generate && npm run build
Start: npm run prisma:migrate:deploy && npm run start
```

Variables a fournir:

- `JWT_SECRET`

Notes pratiques:

- en local, continue a travailler sur `feature/*`, puis fusionne vers `dev`, puis `prod` pour deploiement
- `Render` consommera la branche `prod`, ce qui respecte la regle "main n'est jamais touchee"

## CI/CD GitHub Actions

Le workflow [ci.yml](./.github/workflows/ci.yml) gere maintenant:

- CI sur `pull_request` et `push` vers `dev`, `prod` et `main`
- build TypeScript
- generation du client Prisma
- tests unitaires
- deploiement Render automatique uniquement apres un `push` reussi sur `prod`

Secret GitHub obligatoire:

- `RENDER_DEPLOY_HOOK_URL`

Ou le recuperer:

1. Ouvrir le service Render `pharmacie-221`
2. Aller dans `Settings`
3. Copier le `Deploy Hook`
4. Ajouter la valeur dans `GitHub > Settings > Secrets and variables > Actions`

Important:

- `render.yaml` a `autoDeployTrigger: off` pour eviter les doubles deploiements
- le deploiement est maintenant pilote par GitHub Actions, pas par l'auto-deploy natif de Render
