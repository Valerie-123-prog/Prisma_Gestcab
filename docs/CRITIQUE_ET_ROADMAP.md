# Prisma GestCab — Critique du dépôt et axes de développement

> Analyse réalisée le 3 juillet 2026 sur la branche `main` (commit `159bd04` — « Activé Lovable Cloud »).

**Prisma GestCab** est une application de gestion de cabinet médical (patients, rendez-vous, facturation, documents, rapports) générée avec Lovable, construite sur Vite + React 18 + TypeScript + shadcn/ui + Tailwind CSS, avec Supabase (Lovable Cloud) pour l'authentification. Le contexte cible est le Cameroun (FCFA, Yaoundé).

---

## 1. Vue d'ensemble

| Domaine | État |
|---|---|
| Stack technique | Moderne et cohérente (Vite, React 18, TS, shadcn/ui, React Query, react-hook-form, zod) |
| Fonctionnel couvert | Patients, dossiers médicaux, RDV, facturation, paiements, documents, rapports |
| Persistance des données | ⚠️ **localStorage uniquement** (sauf comptes utilisateurs) |
| Authentification | Supabase Auth + rôles (admin / medecin / secretaire), RLS en place |
| Tests | ❌ Aucun |
| CI/CD | ❌ Aucune |
| Documentation | ❌ README boilerplate Lovable, aucune doc projet |

---

## 2. Points forts

1. **Stack moderne et bien choisie.** Vite + React 18 + TypeScript + shadcn/ui + Tailwind est un socle solide et productif. React Query, react-hook-form et zod sont déjà installés — les bons outils sont là.

2. **Découpage par domaine métier lisible.** `src/components/{patients,billing,appointments,documents,reports,home,layout,common}` et `src/pages/` : la structure suit le métier, on s'y retrouve vite. Les types métier sont centralisés dans `src/types/`.

3. **Base d'authentification étonnamment propre.**
   - `AuthContext` enregistre le listener `onAuthStateChange` *avant* `getSession()` (évite la course classique).
   - Les migrations SQL (`supabase/migrations/`) appliquent les bonnes pratiques : RLS activée sur `profiles` et `user_roles`, fonction `has_role()` en `SECURITY DEFINER` avec `search_path` fixé pour éviter la récursion RLS, `REVOKE EXECUTE` sur les fonctions internes, trigger `handle_new_user` pour créer profil + rôle à l'inscription.
   - `ProtectedRoute` gère correctement l'état de chargement et la redirection avec retour (`state.from`).

4. **Couverture fonctionnelle déjà large pour un MVP.** Dossier médical (antécédents, traitements, consultations), gestion de créneaux avec horaires d'ouverture et jours fériés, liste d'attente, facturation avec paiements partiels et statuts, statistiques d'activité.

5. **Localisation adaptée au contexte.** Interface en français, montants en FCFA, coordonnées camerounaises par défaut — le produit sait à qui il s'adresse.

6. **Validation partiellement en place.** `PatientForm` et `AppointmentForm` utilisent `react-hook-form` + `zodResolver` ; les autres formulaires utilisent au moins `react-hook-form`.

---

## 3. Points critiques

### 3.1 🔴 Les données médicales vivent dans `localStorage` (bloquant)

C'est **le** problème structurel du projet. `PatientContext`, `AppointmentContext` et `BillingContext` persistent tout (patients, consultations, traitements, RDV, factures, paiements, paramètres) dans le `localStorage` du navigateur. Conséquences :

- **Perte de données garantie** : vider le cache, changer de navigateur ou de poste = tout disparaît. Aucune sauvegarde possible.
- **Mono-poste et mono-utilisateur de fait** : le médecin et la secrétaire ne peuvent pas voir les mêmes données ; deux onglets peuvent même s'écraser mutuellement.
- **Confidentialité** : des données de santé sont stockées en clair sur le poste client, lisibles par quiconque ouvre les DevTools — la déconnexion ne protège rien.
- **L'infrastructure Supabase est déjà là et inutilisée** : seules les tables `profiles` et `user_roles` existent. L'authentification protège l'accès aux écrans, pas aux données.

Le module **Documents** est encore en deçà : il repose sur des données mockées en dur (`mockDocuments` dans `Documents.tsx`) et ne persiste rien du tout, pas même en localStorage.

### 3.2 🔴 Failles du modèle de sécurité

- **Toute personne qui s'inscrit devient `medecin`** : le trigger `handle_new_user` attribue automatiquement le rôle `medecin` à chaque nouveau compte, et la page `/signup` est publique. N'importe qui peut donc créer un compte « médecin » et accéder à l'application.
- **Les rôles ne servent à rien côté applicatif** : aucune différence de droits entre admin, médecin et secrétaire dans l'UI ou les données.
- **`.env` est commité dans le dépôt** et absent du `.gitignore`. La clé actuelle est une clé *publishable* (destinée au client), donc pas de fuite critique aujourd'hui, mais la pratique est dangereuse : le jour où quelqu'un y ajoute une clé secrète, elle part dans l'historique git.
- **Aucune trace d'audit** : suppression d'un patient ou d'une facture = disparition sans historique, inacceptable pour des données médicales et comptables.

### 3.3 🟠 Bugs et fragilités identifiés dans le code

| Localisation | Problème |
|---|---|
| `BillingContext.generateInvoiceNumber` | Le compteur de numéros de facture vit dans le localStorage de chaque poste → **collisions garanties** dès qu'il y a deux navigateurs. La numérotation doit être une séquence côté base de données. |
| `BillingContext.addPayment` | Le total payé est recalculé à partir de l'état `payments` potentiellement obsolète (closure) ; deux paiements enregistrés rapidement peuvent produire un statut incohérent. |
| `BillingContext.deleteInvoice` | Supprime la facture **et ses paiements** : perte d'historique comptable. Une facture émise devrait être annulée (avoir), jamais effacée. |
| `AppointmentContext.getAvailableSlots` | La détection de conflit ne compare que l'heure de début exacte (`apt.startTime === currentTime`). Un RDV de 45 min ne bloque que son créneau de départ : **les chevauchements partiels ne sont pas détectés**, double réservation possible. |
| Tous les contextes | Réhydratation des dates par nom de clé JSON (`if (key === 'date') return new Date(value)`) : fragile, et aucun `try/catch` autour de `JSON.parse` — un localStorage corrompu fait planter l'application au démarrage. |
| `ExportData.exportToPDF` | L'« export PDF » génère en réalité un fichier `.txt` tout en affichant « exportés en PDF » à l'utilisateur. |
| `ExportData.exportToExcel` | CSV sans échappement des guillemets ni des virgules dans les valeurs entre guillemets (`"${value}"` casse si la valeur contient un `"`), et sérialise les objets imbriqués en `[object Object]`. |

### 3.4 🟠 Rigueur TypeScript désactivée

`tsconfig` : `strict: false`, `noImplicitAny: false`, `strictNullChecks: false`. Une grande partie de la valeur de TypeScript est perdue — les erreurs de nullité (fréquentes avec des données patient optionnelles) ne sont pas détectées. Quatre usages explicites de `any` subsistent (`ExportData`, `AdvancedFilters`, `GlobalSearch`, `InvoiceForm`).

### 3.5 🟠 Aucun filet de sécurité d'ingénierie

- **Zéro test** : pas de Vitest, pas de test de composant, rien sur la logique sensible (calculs de facture, créneaux, statuts de paiement) qui est pourtant celle qui casse le plus facilement.
- **Aucune CI** : pas de `.github/workflows`, pas même de script `typecheck` dans `package.json`. Rien n'empêche de pousser du code qui ne compile pas.
- **Deux lockfiles concurrents** (`bun.lockb` + `package-lock.json`) : source d'installations non reproductibles selon l'outil utilisé.

### 3.6 🟡 Hygiène de dépôt

- `package.json` : nom `vite_react_shadcn_ts`, version `0.0.0` — le projet n'a pas d'identité.
- README 100 % boilerplate Lovable, aucune description du produit, du modèle de données ou des conventions.
- Historique git pollué : cinq commits nommés « Changes », plusieurs « Reverted to commit… » — impossible de retracer l'évolution fonctionnelle.
- Styles incohérents : certaines pages (Login, Signup) utilisent des couleurs codées en dur (`bg-blue-500`, `text-gray-600`) au lieu des tokens sémantiques du design system Tailwind/shadcn définis dans `index.css`.

---

## 4. Axes de développement

### Axe 1 — Migration des données vers Supabase 🔴 *priorité absolue*

Tout le reste en dépend. Tant que les données sont dans localStorage, le produit n'est pas utilisable en conditions réelles.

1. **Modéliser le schéma** : tables `patients`, `consultations`, `treatments`, `appointments`, `consultation_types`, `working_hours`, `holidays`, `waiting_list`, `invoices`, `invoice_items`, `payments`, `documents`, `billing_settings` — avec RLS systématique.
2. **Introduire la notion de cabinet** (`clinics` + `clinic_members`) : les données appartiennent au cabinet, pas au navigateur ; médecin et secrétaire du même cabinet voient les mêmes patients.
3. **Numérotation des factures côté base** (séquence ou fonction SQL transactionnelle) pour éliminer les collisions.
4. **Remplacer les contextes par React Query** (`useQuery`/`useMutation` + invalidation) : la bibliothèque est déjà installée ; les contextes actuels deviennent inutiles.
5. **Stratégie de migration** : écran d'import unique qui pousse les données localStorage existantes vers Supabase à la première connexion, puis suppression du localStorage.
6. **Module Documents** : brancher Supabase Storage (upload réel, URL signées, RLS sur le bucket) et supprimer `mockDocuments`.

### Axe 2 — Sécurité, rôles et conformité 🔴

1. **Fermer l'inscription ouverte** : ne plus attribuer `medecin` par défaut. Nouveau compte = rôle en attente ; un admin valide et attribue le rôle (ou système d'invitation par le cabinet).
2. **Exploiter réellement les rôles** : la secrétaire gère RDV et facturation mais pas le dossier médical ; seul l'admin gère les membres et les paramètres. À appliquer côté RLS *et* côté UI.
3. **Journal d'audit** : table `audit_log` alimentée par triggers sur les tables sensibles (qui a vu/modifié/supprimé quoi, quand).
4. **Interdire la suppression physique** des factures et dossiers patients : passer à l'archivage (soft delete) et aux avoirs pour la facturation.
5. **Hygiène des secrets** : retirer `.env` du suivi git (`git rm --cached .env`), l'ajouter au `.gitignore`, fournir un `.env.example`.
6. **Conformité données de santé** : documenter le positionnement vis-à-vis de la réglementation applicable (loi camerounaise sur la protection des données, RGPD si patients européens) : consentement, droit à l'effacement/archivage, durées de rétention.

### Axe 3 — Qualité d'ingénierie 🟠

1. **CI GitHub Actions** : `lint` + `tsc --noEmit` + `build` (+ tests dès qu'ils existent) sur chaque PR. C'est une demi-journée de travail qui protège tout le reste.
2. **Tests** : Vitest + React Testing Library. Commencer par la logique pure à forte valeur : calculs de facture et statuts de paiement, génération de créneaux et détection de conflits, échappement CSV. Ajouter ensuite quelques parcours Playwright (connexion, création patient, prise de RDV, facturation).
3. **TypeScript strict progressif** : activer `strictNullChecks` d'abord, corriger, puis `strict: true`. Éliminer les `any` restants.
4. **Corriger les bugs listés en §3.3** — chacun est petit, l'ensemble se traite en quelques jours.
5. **Assainir le dépôt** : un seul lockfile (choisir npm *ou* bun), nommer le package `prisma-gestcab`, écrire un vrai README (description, architecture, modèle de données, démarrage local, conventions de commit).

### Axe 4 — Compléter et fiabiliser les modules métier 🟠

1. **Exports dignes de ce nom** : vrai PDF (jsPDF ou react-pdf) pour factures, ordonnances et listes ; CSV correctement échappé avec colonnes choisies (pas `Object.keys` brut).
2. **Impression de documents médicaux** : facture imprimable avec en-tête du cabinet, ordonnance, certificat médical — c'est le quotidien d'un cabinet.
3. **RDV robustes** : détection de chevauchement réelle (intervalle contre intervalle), RDV récurrents, vue par praticien.
4. **Rappels de RDV** : SMS et/ou WhatsApp (canaux dominants au Cameroun) via un fournisseur local ou Twilio ; réduction directe des rendez-vous manqués.
5. **Facturation** : gestion des avoirs, remises, prise en charge assurance/mutuelle, rapprochement des paiements.

### Axe 5 — Produit et croissance 🟡

1. **Multi-praticien / multi-cabinet** : agenda par praticien, statistiques par praticien, gestion des membres du cabinet.
2. **Paiement mobile** : intégration MTN Mobile Money / Orange Money — moyen de paiement dominant sur le marché cible ; enregistrer la référence de transaction sur le paiement.
3. **Mode hors-ligne réel (PWA)** : la connectivité étant irrégulière, une PWA avec cache et file de synchronisation (et résolution de conflits) est un vrai différenciateur — c'est la bonne réponse au besoin que le localStorage actuel essayait maladroitement de couvrir.
4. **Tableau de bord** : consolidation des indicateurs (CA, impayés, taux de remplissage, nouveaux patients) sur la page d'accueil connectée.
5. **Portail patient** (long terme) : prise de RDV en ligne, rappels, accès aux documents.

---

## 5. Priorisation proposée

| Phase | Contenu | Objectif |
|---|---|---|
| **P0** (2–4 semaines) | Axe 1 (schéma + migration patients/RDV/facturation) + Axe 2 points 1, 4, 5 + CI minimale | Données réelles en base, sécurisées ; plus de perte de données possible |
| **P1** (3–4 semaines) | Fin Axe 1 (documents, React Query partout) + Axe 2 (rôles, audit) + Axe 3 (tests, TS strict, bugs §3.3) | Application fiable et maintenable, multi-utilisateur |
| **P2** (4–6 semaines) | Axe 4 (PDF, impression, rappels SMS/WhatsApp, RDV robustes) | Valeur métier quotidienne pour le cabinet |
| **P3** (continu) | Axe 5 (Mobile Money, PWA offline, multi-praticien, dashboard) | Différenciation et croissance |

**Règle de décision simple** : aucune nouvelle fonctionnalité ne devrait être développée tant que la P0 n'est pas terminée — chaque écran ajouté sur la base localStorage actuelle augmentera le coût de la migration.
