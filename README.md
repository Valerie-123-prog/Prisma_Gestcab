# Prisma GestCab

Application de gestion de cabinet médical : patients et dossiers médicaux, rendez-vous, facturation (FCFA), documents et rapports d'activité. Interface en français, pensée pour le contexte camerounais (paiements espèces / Orange Money / MTN Mobile Money).

Projet créé avec [Lovable](https://lovable.dev/projects/4a42d2b4-7064-43e2-b82f-7b035539fd5b) — les modifications faites dans Lovable sont commitées automatiquement dans ce dépôt, et inversement.

## Stack technique

- **Vite + React 18 + TypeScript**
- **shadcn/ui + Tailwind CSS** pour l'interface
- **Supabase** (Lovable Cloud) pour l'authentification et les rôles (`admin`, `medecin`, `secretaire`)
- **React Query, react-hook-form, zod** pour les données et formulaires

## Démarrage local

Prérequis : Node.js 18+ (le fichier `.npmrc` active `legacy-peer-deps`, nécessaire pour `react-day-picker`).

```sh
npm install        # installer les dépendances
npm run dev        # serveur de développement
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Build de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript (`tsc --noEmit`) |
| `npm test` | Tests unitaires (Vitest) |

## Structure

```
src/
  pages/          # Une page par module (Patients, Appointments, Billing, Documents, Reports…)
  components/     # Composants par domaine métier + shadcn/ui dans components/ui/
  contexts/       # État applicatif (Auth via Supabase ; patients/RDV/facturation en localStorage — migration Supabase prévue)
  lib/            # Logique pure testée (csv, timeUtils, billingUtils, storage…)
  types/          # Types métier partagés
  integrations/   # Clients Supabase et Lovable générés
supabase/
  migrations/     # Migrations SQL (RLS, rôles, profils)
docs/
  CRITIQUE_ET_ROADMAP.md   # Analyse du dépôt et feuille de route
  INSTRUCTIONS_LOVABLE.md  # Instructions à transmettre à Lovable pour la suite du développement
```

## État des données — à savoir

⚠️ Les données métier (patients, rendez-vous, factures) sont pour l'instant stockées dans le **localStorage du navigateur** : mono-poste, sans sauvegarde. La migration vers Supabase est l'étape prioritaire de la feuille de route (voir `docs/CRITIQUE_ET_ROADMAP.md` et `docs/INSTRUCTIONS_LOVABLE.md`).

## Secrets et configuration

Le fichier `.env` est géré par Lovable Cloud et ne contient que des clés **publiques** (`sb_publishable_…`, URL du projet Supabase), sans danger dans le dépôt. **N'y ajoutez jamais de clé secrète** (`sb_secret_…`, clés d'API tierces) : les secrets se configurent dans Lovable Cloud, jamais dans le code.

## Déploiement

Ouvrir [Lovable](https://lovable.dev/projects/4a42d2b4-7064-43e2-b82f-7b035539fd5b) puis **Share → Publish**. Domaine personnalisé : Project > Settings > Domains ([documentation](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)).
