# Instructions à transmettre à Lovable — Prisma GestCab

Ce document contient les **prompts à copier-coller dans Lovable** (lovable.dev), dans l'ordre, pour poursuivre le développement selon la feuille de route (`docs/CRITIQUE_ET_ROADMAP.md`). Les corrections de bugs et l'hygiène du dépôt ont déjà été appliquées directement dans le code (voir le résumé en fin de document) ; ce qui suit couvre ce qui nécessite Lovable Cloud (base de données, stockage, rôles) et les évolutions fonctionnelles.

## Conseils d'utilisation

- **Envoyer un prompt à la fois**, vérifier le résultat (créer un patient, un RDV, une facture de test), puis passer au suivant.
- **Ne pas réordonner la phase 1** : chaque étape s'appuie sur la précédente.
- Après chaque étape touchant la base de données, vérifier dans Lovable Cloud que les tables et les politiques RLS annoncées existent bien.
- En cas d'erreur après une étape, la signaler à Lovable dans le message suivant plutôt que d'enchaîner.

---

## Phase 1 — Migrer les données vers Supabase (priorité absolue)

> Objectif : plus aucune donnée métier dans le localStorage. Tant que cette phase n'est pas finie, ne pas demander de nouvelles fonctionnalités.

### Prompt 1.1 — Schéma de base de données

> Crée le schéma Supabase pour les données métier de l'application, avec Row Level Security sur chaque table. Tables à créer : `patients` (identité, coordonnées, contact d'urgence, antécédents, allergies, traitements en cours, numéro d'assurance), `consultations` (liée à patients : date, motif, diagnostic, prescription, notes), `treatments` (liée à patients : nom, posologie, dates de début/fin), `appointments` (patient, date, heure de début et de fin, type de consultation, statut, motif, notes), `consultation_types` (nom, durée en minutes, couleur, prix), `working_hours` (jour de la semaine, heures d'ouverture/fermeture, actif), `holidays` (date, nom, récurrent), `waiting_list` (patient, type de consultation, téléphone, dates préférées), `invoices` (patient, numéro, date, échéance, lignes dans une table `invoice_items`, totaux, statut, notes), `payments` (facture, montant, moyen de paiement, date, notes), `billing_settings` (coordonnées du cabinet, prix de consultation par défaut, préfixe de facturation). Utilise des types enum PostgreSQL pour les statuts (statut de RDV, statut de facture, moyen de paiement : cash, orange_money, mtn_mobile_money, check, transfer). Chaque table doit avoir created_at/updated_at avec trigger de mise à jour. Pour l'instant, les politiques RLS donnent accès à tout utilisateur authentifié ; la notion de cabinet arrivera dans une étape ultérieure. Ne modifie pas encore le code React.

### Prompt 1.2 — Numérotation des factures côté base

> La numérotation des factures doit être garantie par la base de données, pas par le client. Crée une fonction PostgreSQL transactionnelle qui attribue le prochain numéro de facture (préfixe + compteur à 4 chiffres, ex. FAC-0042) en s'appuyant sur une ligne de compteur verrouillée dans `billing_settings`, et fais en sorte que l'insertion d'une facture passe par cette fonction pour éviter tout doublon même si deux postes créent une facture en même temps.

### Prompt 1.3 — Brancher le module Patients sur Supabase

> Remplace le stockage localStorage du module Patients par Supabase. Utilise React Query (déjà installé) : hooks `useQuery` pour lire les patients, `useMutation` avec invalidation pour créer/modifier/supprimer patients, consultations et traitements. Supprime la logique localStorage correspondante de `src/contexts/PatientContext.tsx` (le helper `src/lib/storage.ts` reste utilisé par les autres modules tant qu'ils ne sont pas migrés). Prévois un état de chargement et un état d'erreur visibles dans les pages Patients et PatientDetail. Important : au premier chargement après la migration, si le localStorage contient encore des patients (`localStorage.getItem('patients')`), propose à l'utilisateur d'importer ces données vers Supabase via une bannière avec bouton « Importer mes données locales », puis nettoie le localStorage après import réussi.

### Prompt 1.4 — Brancher le module Rendez-vous sur Supabase

> Fais la même migration pour le module Rendez-vous : `appointments`, `consultation_types`, `working_hours`, `holidays`, `waiting_list` lus et écrits via Supabase avec React Query, plus d'accès localStorage dans `src/contexts/AppointmentContext.tsx`. Conserve la logique de génération de créneaux et de détection de chevauchement existante (`src/lib/timeUtils.ts` — ne pas la réécrire), en la nourrissant des données Supabase. Même mécanisme d'import des données localStorage existantes que pour les patients.

### Prompt 1.5 — Brancher le module Facturation sur Supabase

> Migre le module Facturation : `invoices`, `invoice_items`, `payments`, `billing_settings` via Supabase et React Query, plus d'accès localStorage dans `src/contexts/BillingContext.tsx`. La création de facture doit utiliser la fonction de numérotation côté base (étape 1.2). Conserve les règles métier déjà en place : statut de facture dérivé du total payé (`src/lib/billingUtils.ts`), et interdiction de supprimer une facture ayant reçu un paiement. Même mécanisme d'import des données locales.

### Prompt 1.6 — Module Documents réel

> Le module Documents utilise des données factices (`mockDocuments` dans `src/pages/Documents.tsx`). Rends-le fonctionnel : crée une table `documents` (nom, type, catégorie, patient, statut, résultats de laboratoire éventuels, chemin du fichier) et un bucket Supabase Storage privé `documents` avec politiques RLS. Le formulaire « Nouveau document » doit permettre d'uploader un vrai fichier (PDF ou image) ; la liste doit permettre de le visualiser et de le télécharger via des URL signées. Supprime les données factices.

---

## Phase 2 — Sécurité et rôles

### Prompt 2.1 — Fermer l'inscription ouverte

> Actuellement, toute personne qui s'inscrit reçoit automatiquement le rôle `medecin` (trigger `handle_new_user`), ce qui est inacceptable pour des données médicales. Change ce comportement : un nouveau compte ne reçoit aucun rôle et voit un écran « Compte en attente de validation » au lieu de l'application. Ajoute une page d'administration (visible uniquement avec le rôle `admin`) qui liste les comptes en attente et permet de leur attribuer un rôle (`medecin` ou `secretaire`) ou de les refuser. Prévois une instruction SQL documentée pour promouvoir manuellement le premier administrateur.

### Prompt 2.2 — Appliquer les rôles dans l'application et la base

> Applique les rôles partout : la secrétaire peut gérer les rendez-vous, la facturation et les informations administratives des patients, mais pas consulter ni modifier les dossiers médicaux (consultations, traitements, antécédents) ; le médecin a accès à tout sauf à la gestion des membres ; l'admin gère en plus les comptes et les paramètres du cabinet. Traduis ces règles à la fois dans les politiques RLS (en t'appuyant sur la fonction `has_role` existante) et dans l'interface (masquer les sections interdites).

### Prompt 2.3 — Journal d'audit et suppression douce

> Ajoute une table `audit_log` alimentée par des triggers PostgreSQL sur les tables patients, consultations, invoices et payments : qui a créé/modifié/supprimé quoi et quand. Remplace les suppressions physiques de patients et de factures par un archivage (`deleted_at` / statut `cancelled` pour les factures) et filtre les éléments archivés des listes. Ajoute une page « Journal d'activité » visible par l'admin.

---

## Phase 3 — Valeur métier quotidienne

### Prompt 3.1 — Impression et vrais PDF

> Ajoute la génération de vrais PDF : facture imprimable avec en-tête du cabinet (nom, adresse, téléphone tirés de `billing_settings`), lignes, totaux, montant payé et reste dû ; et ordonnance imprimable depuis une consultation. Bouton « Imprimer / PDF » sur le détail de facture et sur chaque consultation.

### Prompt 3.2 — Rappels de rendez-vous

> Ajoute les rappels de RDV par SMS et/ou WhatsApp (canaux dominants au Cameroun) via une edge function Supabase planifiée : la veille du RDV, envoyer un rappel au patient avec date, heure et nom du cabinet. Rends le fournisseur configurable (ex. Twilio) avec la clé API stockée dans les secrets Lovable Cloud, jamais dans le code. Ajoute un statut « rappel envoyé » visible sur le RDV.

### Prompt 3.3 — Encaissement Mobile Money

> Prépare l'intégration du paiement mobile : sur l'écran d'enregistrement d'un paiement Orange Money ou MTN Mobile Money, ajoute un champ « référence de transaction » obligatoire, affiché sur la facture et dans les exports. (L'intégration API directe des opérateurs viendra plus tard ; ne pas la commencer sans en discuter.)

### Prompt 3.4 — Tableau de bord

> Transforme la page d'accueil connectée en tableau de bord : RDV du jour, chiffre d'affaires du mois, factures impayées avec total, nouveaux patients du mois, et raccourcis vers les actions fréquentes. Utilise les composants de graphique déjà présents (recharts).

---

## Phase 4 — Améliorations continues (dans n'importe quel ordre)

- **Multi-praticien** : « Ajoute la notion de praticien sur les rendez-vous et l'agenda : chaque RDV est rattaché à un praticien, l'agenda est filtrable par praticien, les statistiques sont ventilées par praticien. »
- **TypeScript strict** : « Active `strictNullChecks` dans tsconfig.app.json et corrige toutes les erreurs, principalement la gestion de `patient.medicalRecord` potentiellement absent dans `src/components/patients/MedicalRecord.tsx`. Ne change aucun comportement visible. »
- **Design system** : « Remplace les couleurs codées en dur (bg-blue-500, text-gray-600, etc.) dans les pages Login, Signup et les composants métier par les tokens sémantiques du design system (primary, muted-foreground, destructive…), pour préparer un éventuel mode sombre. »
- **Découpage du bundle** : « Le bundle JS dépasse 1,3 Mo. Mets en place le lazy loading des routes avec React.lazy/Suspense pour découper le bundle par page. »
- **PWA hors-ligne** : à ne lancer qu'une fois la phase 1 terminée et stable — « Transforme l'application en PWA avec cache hors-ligne et file de synchronisation des écritures, adaptée à une connectivité irrégulière. »

---

## Ce qui a déjà été fait directement dans le code (ne pas redemander à Lovable)

Sur la branche `claude/repo-critique-roadmap-4afbpw` (PR #1) :

- **Correction de ~42 erreurs TypeScript** qui passaient inaperçues (Lovable ne lance pas `tsc`) : types `Document` et `WorkingHours` réalignés sur leur usage réel, `appointment.type` inexistant remplacé par `consultationType.name` (plantage de la recherche globale), statistique « Mobile Money » qui ne comptait jamais rien, contact d'urgence perdu à l'édition d'un patient.
- **Bugs corrigés** : détection de chevauchement réelle des créneaux de RDV (`src/lib/timeUtils.ts`), statut de facture cohérent après paiements rapprochés, numérotation de facture qui rattrape le plus grand numéro émis, interdiction de supprimer une facture payée, lecture du localStorage protégée contre la corruption (`src/lib/storage.ts`).
- **Exports fiabilisés** : CSV correctement échappé avec colonnes explicites (`src/lib/csv.ts`), suppression du faux « export PDF » qui produisait un `.txt`.
- **Outillage** : scripts `typecheck` et `test`, 24 tests unitaires Vitest sur la logique de facturation/créneaux/CSV, workflow GitHub Actions (lint + typecheck + tests + build), `.npmrc` pour que `npm install` fonctionne, suppression du lockfile bun en double, README réécrit, paquet renommé `prisma-gestcab`.
