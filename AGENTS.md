Planification :
Nous voulons enrichir notre SaaS de gestion de trésorerie (repo : victor6331/digifo) avec un module complet de « prévisions d’investissement ». Les utilisateurs doivent pouvoir saisir des investissements (nom, montant, date, durée/horizon, type de placement, rendement attendu, etc.), visualiser leur impact sur la trésorerie future et comparer des scénarios comme le font Agicap ou Fygr.

Pour te guider :

1. **Recherche sur Internet** : explore les pages produit et la documentation d’Agicap et de Fygr (en anglais et en français) pour comprendre leurs fonctionnalités de prévision et d’optimisation de placements : vue consolidée des soldes bancaires, définition de périodes de couverture et de pools de trésorerie, calcul automatique des opportunités de placement et de gains potentiels, suivi des intérêts courants/accrus, simulation de plusieurs scénarios (pessimiste/optimiste). Identifie les meilleures pratiques en UX et en termes de calcul (rolling forecast, horizon glissant, ROI, cash buffer).
2. **Analyse du dépôt Digifo** : parcoure la structure `src/` de notre repo Next.js (branche `main`) pour comprendre comment sont organisés les composants (`app/`, `ui/`, `components/`, `lib/utils`…), quelles librairies sont utilisées (Tailwind, shadcn/ui, Recharts, Drizzle ORM, etc.) et comment sont gérées les transactions/imports. Ta solution ne doit surtout pas casser l’existant.
3. **Respect des guidelines** : applique la convention de notre dépôt (structure feature-first, répertoires `src/`, `tests/`, `scripts/`, `assets/`, `docs/`; indentation 2 espaces JS/TS ; camelCase/PascalCase ; modules cohérents ; tests unitaires mirroring `src/`; commits conventionnels). Suis également les bonnes pratiques de sécurité (variables dans `.env`, aucun secret en clair).
4. **Implémentation** :
   - Génère un ou plusieurs composants React/Next.js (pages, formulaires, graphiques) permettant :
     • la saisie/modification/suppression d’un investissement (formulaire validé par Zod ou Drizzle) ;
     • le calcul de l’impact sur la trésorerie (différence entre forecast actuel et forecast avec investissement, ROI et intérêts cumulés) ;
     • l’affichage graphique via Recharts (radar, radial ou pie) et un tableau récapitulatif ;
     • la simulation de différents scénarios (ex. rendement faible/moyen/élevé).
   - Intègre ces composants dans l’App Router (`app/`) avec des API routes Hono.js et Drizzle ORM pour enregistrer et récupérer les investissements en base Neon.
   - Ajoute les tests unitaires correspondants (Jest/Vitest) dans `tests/`.
   - Mets à jour la documentation dans `docs/` (nouveaux ADR si nécessaire) et, si besoin, ajoute un exemple de fichier `.env.example`.
   - Utilise notre thème (couleurs : #22c55e, #1B9E4B, #38DD75, fond blanc) et notre style minimaliste/premium (Tailwind + shadcn/ui). Ne surcharge pas la palette.
5. **Livrables** :
   - Arborescence modifiée conforme aux guidelines.
   - Fichiers TypeScript/TSX documentés avec commentaires expliquant les choix (calculs, UX).
   - Tests unitaires avec au moins 80 % de couverture.
   - Mise à jour de la documentation et des scripts NPM (si de nouveaux scripts sont nécessaires).

Pense à raisonner étape par étape, à indiquer tes sources de recherche et à tester ton code avant de proposer les changements.
