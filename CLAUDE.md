# CONTEXTE PROJET — Boussole Life OS

> Ce fichier est la mémoire du projet. À lire en priorité avant toute modification.

## Règles et documentation de référence

Toujours chargés :
@docs/AI_ARCHITECTURE_RULES.md
@docs/BUSINESS_RULES.md

Disponibles sur demande (lire si le contexte le nécessite) :
- `docs/SCORE_BOUSSOLE.md` — formule détaillée et exemples du Score Boussole
- `docs/HEALTH_ENGINE.md` — moteur santé, suivi sommeil, calculs
- `docs/LIFE_BALANCE_ENGINE.md` — piliers, profils de semaine, camemberts, score alignement
- `docs/PRODUCT_VISION.md` — identité produit, utilisateur cible, philosophie
- `docs/ROADMAP.md` — backlog, priorités, choix de modèle IA par tâche
- Avant de lire des fichiers, consulte d'abord graphify-out/graph.json pour comprendre la structure et ne lire que le strict nécessaire

## Identité

Projet : **Boussole** — Life OS personnel
Utilisateur : Imanol Dupuy Muret, 21 ans, Limoges, statut étudiant-entrepreneur national
Stack : HTML/CSS/JS vanilla, localStorage, aucun framework, aucun backend
Clé localStorage : `boussole_v1_data`

---

## Architecture générale

### Fichiers
```
index.html   — structure HTML statique (vues, modales, conteneurs)
app.js       — IIFE unique (~3700 lignes), toute la logique
style.css    — tous les styles, variables CSS custom
```

### Pattern JS
Tout le code est dans une IIFE `(function(){ ... })()`.
Les fonctions ne sont PAS globales — ne pas appeler depuis la console ou des scripts externes.
`state` est l'objet central en mémoire, sauvegardé via `saveData()` à chaque mutation.

---

## Structure de données (state)

```js
state = {
  // IDENTITÉ
  pillars: ['familial','social','professionnel','personnel'], // piliers actifs
  vision: '',           // phrase de vision personnelle
  allocations: {        // répartition idéale en % (calculée depuis weekProfiles)
    professionnel: 40, personnel: 25, familial: 15, social: 20
  },

  // PROFILS DE SEMAINE (nouveau système V24)
  weekProfiles: [       // liste de profils de semaine type
    { id:'p_actif', name:'Semaine active', icon:'📚', domains:{
        professionnel: {freq:5, duration:7},   // 5 jours × 7h = 35h/sem
        personnel:     {freq:4, duration:1.5},
        familial:      {freq:3, duration:2},
        social:        {freq:2, duration:3}
      }
    },
    { id:'p_vacances', name:'Vacances', icon:'🌴', domains:{} },
    { id:'p_sprint',   name:'Sprint / Concours', icon:'🎯', domains:{} }
  ],
  activeProfileId: 'p_actif',          // profil actif pour les camemberts
  weekTypeAssignments: {               // { 'YYYY-MM-DD' (lundi) : profileId }
    '2026-06-22': 'p_actif'
  },

  // TÂCHES (système V24 — format obligatoire)
  tasks: [{
    id: 't...',
    text: 'Texte de la tâche',
    urgency: 'hour|day|2days|week|month',  // OBLIGATOIRE
    durationMinutes: null,                  // null si non renseigné
    pillarId: 'professionnel|personnel|familial|social',
    createdAt: '1234567890',               // string
    status: 'todo|done',
    doneAt: null
  }],

  // OBJECTIFS (moyen/long terme uniquement — court terme = tasks)
  goals: [{
    id: 'g...',
    text: 'Texte',
    horizon: 'moyen|long',   // JAMAIS 'court' — supprimé en V24
    pillar: 'professionnel',
    createdAt: 1234567890,
    notes: '',
    status: 'todo|done',
    deadline: null
  }],

  // AGENDA
  blocks: [{
    id: 'b...',
    pillarId: 'professionnel',
    title: 'Titre',
    date: 'YYYY-MM-DD',
    endDate: null,           // pour événements multi-jours
    startHour: 14,           // peut dépasser 23 pour coucher tardif (ex: 24 = 0h)
    startMinute: 30,
    durationMinutes: 90,
    goalId: null,
    isSleepBlock: false,     // true si posé par le calculateur sommeil
    isLunchBlock: false,     // true si posé par le poseur déjeuner
    sleepSessionId: null,    // lien coucher ↔ réveil
    sleepWakeDate: null,     // date du réveil (peut être J+1)
    totalSleepMinutes: null  // durée totale calculée
  }],

  // ROUTINES
  recurring: [{
    id: 'r...',
    text: 'Mobilité — 10 minutes',
    pillarId: 'personnel',
    type: 'libre|fixe|ancré',           // défaut: 'libre'
    timeFixed: {h:8, m:0},              // si type='fixe'
    anchorEvent: 'wake|after_lunch|before_sleep', // si type='ancré'
    durationMinutes: 30,
    frequency: {count: 1, unit: 'day'}  // 'day' = seule unité existante actuellement
  }],
  recurringLog: { 'YYYY-MM-DD': ['r_id1', 'r_id2'] }, // routines cochées

  // JOURNAL QUOTIDIEN
  weekNotes: { 'YYYY-MM-DD': 'texte narratif semaine' },
  journal: { 'YYYY-MM-DD': { text: '', photoDataUrl: null } },

  // SANTÉ
  healthScores: { sommeil:70, activite:70, nutrition:70, prevention:70 },
  sleepTargetMinutes: 480,
  sleepQualityLog: { 'YYYY-MM-DD': 1-5 },

  // FINANCE
  finance: {
    incomes: [],
    expenses: [],
    savingsGoals: [{ id, name, cost, createdAt }]
  },

  // PROJETS
  projects: [{ id, name, pillar, status:'todo|doing|done', notes, links, createdAt }],

  // DIVERS
  energy: 2,              // 1=basse 2=moyenne 3=haute
  customization: { quote:'', backgroundImage:null },
  lastExportAt: null,
  _onboarded: true,
  weekProfiles: [],
  activeProfileId: null,
  weekTypeAssignments: {}
}
```

---

## Navigation (onglets)

Ordre de la barre principale :
1. **Équilibre** (`view-balance`) — ouvert par défaut au lancement
2. **Maintenant** (`view-now`)
3. **Aujourd'hui** (`view-today`)
4. **Semaine** (`view-week`)
5. **Tâches** (`view-list` → hub → `view-tasks` / `view-goals`)
6. **Plus** (`view-more`) → Année, Projets, Finances, Fondations, Suivi santé, Suivi sommeil, Mes lieux, Aide

Vues secondaires (activées depuis le menu Plus) :
`year`, `goals`, `projects`, `finance`, `balance`, `foundations`, `medical`, `help`, `sleep-tracking`, `tasks`, `locations`

---

## Fonctions clés

| Fonction | Rôle |
|---|---|
| `saveData()` | Sauvegarde `state` en localStorage |
| `renderNow()` | Vue Maintenant : tâches prioritaires + score Boussole |
| `renderAgenda()` | Vue Aujourd'hui : 4 plages horaires + blocs |
| `renderWeek()` | Vue Semaine : planning narratif + sélecteur de type |
| `renderYear()` | Vue Année : 52 semaines colorées + mode assignation |
| `renderBalance()` | Vue Équilibre : profils + camemberts + santé |
| `renderTasks()` | Liste des tâches triées par urgence |
| `renderGoalsList()` | Liste des objectifs moyen/long terme |
| `switchToView(name)` | Navigation entre vues |
| `openBlockEditor(startMin, block)` | Modale d'ajout/édition de bloc |
| `computeRealSplit()` | Calcule la répartition réelle depuis l'agenda de la semaine |
| `computeAlignmentScore(ideal, real)` | Score d'alignement 0-100 |
| `startWizard(profile)` | Lance le wizard guidé de configuration d'un profil |
| `renderWizardStep()` | Affiche une étape du wizard |
| `ensureProfiles()` | Initialise les profils si absents |
| `profileHoursPerWeek(profile)` | Calcule les h/sem par domaine depuis un profil |
| `hoursToPercents(hours)` | Convertit des heures en pourcentages |
| `drawPie(svgId, data)` | Dessine un camembert SVG |
| `loadJournal()` | Charge le journal du jour affiché |
| `recurringEffectiveStartMin(r, dayBlocks)` | Heure effective d'une routine selon son type (non branchée dans l'UI actuellement) |
| `quickCaptureAdd(text)` | Capture rapide (`#capture-input`, écran Maintenant) — NLP léger : bloc agenda direct si date+heure détectées, modale de clarification si jour ou intention d'objectif détectés, sinon tâche simple. Anciennement nommée `addTask`, renommée pour éliminer une collision de nom avec `addTask()` de la vue Tâches |
| `routineDayKey(date)` | Clé de "jour routine" — reset à 6h du matin, pas minuit (voir section Routines) |
| `saveRoutine()` | Création d'une routine depuis la modale (`#routine-modal-backdrop`) |
| `renderRoutinesSection()` | Rend la liste des routines "à faire aujourd'hui" dans `view-tasks`, appelée à la fin de `renderTasks()` |

---

## Système de camemberts (V24)

### Concept clé
Le camembert idéal n'est PAS défini par des pourcentages arbitraires.
Il est calculé depuis les **heures réelles** définies par l'utilisateur via le wizard :
- Pour chaque domaine : `fréquence × durée = heures/semaine`
- Le pourcentage est calculé automatiquement : `heures_domaine / total_heures`

### Profils de semaine
L'utilisateur crée plusieurs profils (Semaine active, Vacances, Sprint...).
Chaque profil a sa propre répartition horaire.
Les semaines de l'année peuvent être assignées à un profil (via la vue Année).

### Score Boussole
```
Score = 0.6 × AlignementScore + 0.4 × SantéScore
AlignementScore = 100 - (somme des écarts absolus) / 2
SantéScore = moyenne des 4 dimensions santé (0-100)
```

---

## Vue Aujourd'hui — plages horaires

4 plages FIXES (pas dynamiques) :
- Matinée : 6h00 – 12h00
- Midi : 12h00 – 14h00  
- Après-midi : 14h00 – 18h00
- Soirée : 18h00 – 0h00

**Règle d'affichage :** une plage vide affiche juste son en-tête. Seuls les créneaux occupés s'affichent à l'intérieur. Cliquer sur l'en-tête d'une plage ouvre la modale d'ajout avec l'heure de début pré-remplie.

### Blocs de sommeil
- `startHour` peut dépasser 23 (ex: 24 pour 0h, 25 pour 1h) — heures étendues pour le tri
- Le coucher reste TOUJOURS sur `viewedDate`, même si l'heure dépasse minuit
- Le réveil est posé sur le jour suivant
- Durée du repère : 30 minutes (juste un marqueur visuel)

---

## Vue Semaine

Planning narratif : une ligne par jour avec une phrase.
- Auto-générée depuis le bloc le plus long du jour (hors sommeil/déjeuner)
- Modifiable manuellement au clic (stocké dans `state.weekNotes`)
- Sélecteur de type de semaine en haut (assigne le profil à cette semaine)
- Cliquer sur la date (chiffre) → ouvre l'agenda du jour

---

## Vue Année

Grille de 52 semaines (lignes de 7 petits carrés).
Couleur par semaine : type de profil assigné > pilier dominant des blocs.
Mode "Assigner" : sélectionner un type puis cliquer/balayer les semaines.

---

## CSS — règles importantes

**CONFLIT RÉSOLU en V24 :** `.block` (blocs d'agenda, `position:absolute`) vs `.btn.block` (boutons full-width).
→ Les boutons full-width utilisent maintenant **`.btn.full`** (pas `.btn.block`).
Ne jamais ajouter de classe `.block` sur un bouton.

**Variables CSS principales :**
```css
--bg: #111318           /* fond principal */
--bg-raised: #181B22    /* cartes */
--bg-input: #1E222B     /* inputs */
--ink: #E8E6E1          /* texte principal */
--ink-dim: #8B8A85      /* texte secondaire */
--ink-faint: #555452    /* texte discret */
--accent: #6EBF8B       /* vert sauge — accent principal */
--accent-dim: #233B2D   /* fond accent */
--calm: #7B77D4         /* violet — navigation active */
--card-border: #2A2E38  /* bordures de cartes */
--radius: 12px
--radius-sm: 8px
--radius-lg: 16px
```

**Piliers — couleurs :**
```js
professionnel: '#7B77D4'  // violet
personnel:     '#6EBF8B'  // vert sauge
familial:      '#F59E0B'  // orange/jaune
social:        '#EC4899'  // rose
```

**Palette profils de semaine :**
```js
['#7B77D4','#F59E0B','#EC4899','#06B6D4','#84CC16','#F97316']
```

---

## Badges d'urgence (tâches)

```css
.urgency-hour  { color: #F87171 }  /* rouge  — dans l'heure */
.urgency-day   { color: #FB923C }  /* orange — aujourd'hui */
.urgency-2days { color: #FBBF24 }  /* jaune  — dans 2 jours */
.urgency-week  { color: #6EBF8B }  /* vert   — cette semaine */
.urgency-month { color: #60A5FA }  /* bleu   — ce mois */
.urgency-custom{ color: #A78BFA }  /* violet — date précise */
.urgency-note  { color: #94A3B8 }  /* gris   — note, sans échéance */
```

---

## Géolocalisation

Module actif depuis le commit `a28a32e` (2026-07-01), jamais documenté jusqu'ici — état constaté du code réel, pas une conception nouvelle.

### État
```js
state.knownLocations = [{ id, name, lat, lng, pillarId, visitCount }]
state.geoTrackingEnabled = true  // toujours à true en pratique : aucun réglage UI pour le désactiver
```

### Fonctions principales
| Fonction | Rôle |
|---|---|
| `geoCheck()` | Demande la position au navigateur (`getCurrentPosition`), appelée toutes les 60s (15s en trajet détecté) |
| `onGeoPosition(pos)` | Cœur de la logique : détection de trajet, gestion d'ancre, déclenche confirmation ou création de bloc |
| `findKnownLocation(lat, lng)` | Cherche un lieu connu à ≤500m (rayon fixe, indépendant de tout paramètre par lieu) |
| `createGeoBlock(name, pillarId, locId)` | Crée un bloc agenda depuis un lieu détecté ; incrémente `visitCount` du lieu si `locId` fourni |

### Constantes de confiance
- `TRUSTED_VISIT_THRESHOLD = 5` — nombre de visites confirmées à partir duquel un lieu connu déclenche la création automatique d'un bloc ; en dessous, retour au flux de confirmation (bannière pré-remplie, un clic)
- `GEO_ACCURACY_IGNORE_THRESHOLD = 500` — mètres ; un relevé GPS moins précis que ça est ignoré intégralement (ni `_prevPos`, ni `_geo`, ni aucun state touché)
- `GEO_MOVE_ACCURACY_MARGIN = 1.5` — un déplacement (trajet ou reset d'ancre) n'est retenu que s'il dépasse `accuracy × ce facteur`, pour éviter qu'un pic d'imprécision GPS soit interprété comme un vrai déplacement

### Dépendances externes — exception à la règle "zéro dépendance"
Contrairement à la contrainte de stack (section 1.1), ce module appelle deux services externes, actifs et utilisés en production :
- **Nominatim** (OpenStreetMap) — géocodage inverse (nom de lieu depuis lat/lng) et recherche d'adresse, via `fetch` direct
- **Leaflet** (CDN cdnjs, avec intégrité SRI) — carte interactive dans la vue "Mes lieux" (`view-locations`) pour placer un lieu manuellement

---

## Routines

### Structure
```js
state.recurring = [{
  id, text, pillarId, type: 'libre',   // seul 'libre' est créé aujourd'hui via l'UI
  frequency: {count: 1, unit: 'day'}    // 'day' = seule unité existante ; select gardé extensible côté HTML
}]
state.recurringLog = { 'YYYY-MM-DD' (clé "jour routine") : ['r_id1', 'r_id2'] }  // routines cochées ce jour-là
```

### `routineDayKey(date)`
Point d'entrée unique pour la clé de "jour routine" — **reset à 6h du matin, pas à minuit** : une routine cochée à 1h du matin compte pour la veille (le "jour routine" en cours), pas pour le nouveau jour civil. Jamais recalculée inline ailleurs — toujours passer par cette fonction pour associer une action à un jour routine.

### Flux de création
Bouton "+ Ajouter une routine" (entre `#task-capture-wrap` et `#tasks-list`, vue Tâches) → modale (`#routine-modal-backdrop`, fermeture par Annuler / clic backdrop / Escape) → `saveRoutine()` : `pillarId` détecté automatiquement (`detectPillar(text)`, même mécanisme que les tâches), pas de sélection manuelle de pilier.

### Affichage
`renderRoutinesSection()` liste, dans `view-tasks` sous `#tasks-list`, les routines dont l'id n'est pas encore dans `recurringLog[routineDayKey(Date.now())]` — pas de badge d'urgence, pas de tri par priorité. Cocher une routine l'ajoute au log et la fait disparaître immédiatement de la liste (jusqu'au prochain jour routine).

### Ancien système retiré
Une première tentative d'UI (formulaire `#recurring-form`, affichage dans l'agenda) a été supprimée : le HTML correspondant n'a jamais existé dans `index.html`, le code JS était mort depuis le premier commit du dépôt. `recurringEffectiveStartMin(r, dayBlocks)` (heure effective selon `type: 'fixe'|'ancré'`) est conservée telle quelle en vue d'une réutilisation future, mais n'est appelée par rien actuellement.

---

## Migrations de données (rétrocompatibilité)

Lors du chargement (`loadData()`), plusieurs migrations sont appliquées :
- Anciennes tâches (format `done/importance/effort`) → converties vers `status/urgency`
- Goals `horizon:'court'` → supprimés (remplacés par tasks)
- Routines sans `type` → `type:'libre'` par défaut
- `weekProfiles` absent → 3 profils par défaut créés
- `weekTypeAssignments` absent → `{}`
- `healthScores` absent → `{sommeil:70, activite:70, nutrition:70, prevention:70}`
- `recurring`/`recurringLog` absents → `[]`/`{}` (garde défensive, absente jusqu'à récemment)
- `recurring` sans `frequency` → `{count:1, unit:'day'}` (comportement quotidien implicite déjà en vigueur, donc pas un changement observable)
- `knownLocations` sans `visitCount` → `TRUSTED_VISIT_THRESHOLD` (pas 0, pour ne pas faire retomber des lieux déjà fiables dans le flux de confirmation — voir section Géolocalisation)

Les migrations les plus récentes sont numérotées (`// MIGRATION N`) dans `loadData()` ; les plus anciennes listées ci-dessus ne le sont pas — numérotation introduite progressivement, pas de renumérotation rétroactive.

---

## Ce qui est prévu / à faire

### Priorités immédiates
- [ ] Tester sur iPhone Safari (persistance localStorage)
- [ ] Hébergement stable (GitHub Pages recommandé)
- [ ] Vérifier que le wizard de profil se ferme proprement sur mobile

### Fonctionnalités identifiées (non codées)
- [ ] Profils saisonniers : déjà en place via weekProfiles, mais les horaires par profil ne sont pas encore utilisés pour moduler l'agenda automatiquement
- [ ] Score Santé : les 4 curseurs existent, mais le calcul n'est pas encore connecté au sleepQualityLog ou aux données d'activité réelles
- [ ] Synchronisation multi-appareils : nécessite un backend (hors scope pour l'instant)
- [ ] Démultiplier les horaires de coucher/lever selon les jours de la semaine

### Décisions actées (ne pas revenir dessus sans raison)
- Pas de framework JS — rester en vanilla pour la portabilité
- Pas de score sur les tâches — urgence uniquement (7 niveaux, voir section Badges d'urgence)
- Court terme = tasks, pas goals
- Bornes des plages horaires FIXES (6/12/14/18/0h)
- Le coucher reste TOUJOURS sur viewedDate, même si l'heure dépasse minuit

---

## Commandes utiles

```bash
# Ouvrir la dernière version directement (pas besoin de serveur)
# file:///C:/Users/dupuy/OneDrive/Bureau/KAIRO/boussole-claudecode/boussole_final.html

# Vérifier la syntaxe JS
node --check app.js

# Taille du projet
wc -l app.js style.css index.html
```

