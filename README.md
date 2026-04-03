# GestPharmacieApi_express_221

Base d'API Express + TypeScript + Prisma pour une application de gestion de pharmacie.

## Architecture

```text
pharma-221/
├── .github/workflows/ci.yml
├── prisma/
├── src/
│   ├── config/
│   ├── container/
│   ├── common/
│   ├── middlewares/
│   ├── modules/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
├── tests/
├── docker/
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
