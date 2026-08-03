# BUSINESS_RULES.md — Boussole Life OS

## Règles métier fondamentales

Ce document liste les règles métier du projet Boussole. Ces règles ne doivent jamais être contredites par une implémentation technique, sauf décision explicite documentée.

---

## 1. Piliers de vie

### 1.1 Définition
L'application supporte 4 piliers de vie fixes :
- `professionnel` — travail, études, projets
- `personnel` — santé, sport, développement personnel
- `familial` — famille, proches directs
- `social` — amis, loisirs, vie sociale

### 1.2 Couleurs associées (immuables)
```
professionnel → #7B77D4  (violet)
personnel     → #6EBF8B  (vert sauge)
familial      → #F59E0B  (orange/jaune)
social        → #EC4899  (rose)
```

Ces couleurs sont utilisées dans les camemberts, les blocs agenda, les badges, et les étiquettes de pilier. Elles ne doivent pas être modifiées sans raison forte.

---

## 2. Tâches

### 2.1 Niveaux d'urgence (7 niveaux fixes)
| Code | Label | Couleur | Signification |
|------|-------|---------|---------------|
| `hour` | Dans l'heure | #F87171 (rouge) | Action immédiate requise |
| `day` | Aujourd'hui | #FB923C (orange) | À faire dans la journée |
| `2days` | Dans 2 jours | #FBBF24 (jaune) | Priorité haute mais pas urgente |
| `week` | Cette semaine | #6EBF8B (vert) | À traiter dans la semaine |
| `month` | Ce mois | #60A5FA (bleu) | Objectif mensuel |
| `custom` | Date précise | #A78BFA (violet) | Délai ou date/heure choisis explicitement |
| `note` | 📝 Notes | #94A3B8 (gris) | Sans échéance — pense-bête, pas une action datée |

**Règle :** ces 7 niveaux sont fixes (`URGENCY_LABELS` dans `app.js`). Si une tâche dépasse le mois avec une échéance réelle, c'est un objectif (`goals`), pas une tâche — mais `custom` et `note` restent des tâches, pas des objectifs : `custom` sert une date précise (au-delà d'un mois y compris), `note` sert l'absence totale d'échéance.

### 2.2 Statuts
- `todo` — à faire
- `done` — terminée (horodatée via `doneAt`)

### 2.3 Pas de score sur les tâches
Les tâches n'ont pas de notion d'importance, d'effort ou de priorité numérique. L'urgence est le seul critère de tri. Cette décision est actée et ne doit pas être remise en question sans raison majeure.

### 2.4 Pas de tâches court terme dans goals
Les objectifs (`goals`) ne peuvent pas avoir `horizon: 'court'`. Les objectifs court terme sont gérés via les tâches. En cas de migration, les goals `horizon: 'court'` sont supprimés.

---

## 3. Objectifs

### 3.1 Horizons autorisés
- `moyen` — quelques semaines à quelques mois
- `long` — 6 mois et au-delà

### 3.2 Association pilier
Tout objectif doit être rattaché à un pilier de vie.

---

## 4. Blocs agenda

### 4.1 Plages horaires fixes
La journée est découpée en 4 plages immuables :
```
Matinée   : 6h00  – 12h00
Midi      : 12h00 – 14h00
Après-midi: 14h00 – 18h00
Soirée    : 18h00 – 0h00
```
Ces plages ne sont pas configurables par l'utilisateur. Elles ne doivent pas être rendues dynamiques.

### 4.2 Coucher / réveil
- Le coucher est **toujours posé sur `viewedDate`**, même si l'heure dépasse minuit (ex : `startHour: 24` = 0h, `startHour: 25` = 1h)
- Le réveil est posé sur le jour suivant (`sleepWakeDate`)
- Le bloc de coucher a une durée visuelle de 30 minutes (marqueur, pas durée réelle)

### 4.3 Blocs spéciaux
- `isSleepBlock: true` — posé par le calculateur sommeil
- `isLunchBlock: true` — posé par le poseur déjeuner

---

## 5. Routines

### 5.1 Types de routine
| Type | Description |
|------|-------------|
| `libre` | Positionnée manuellement ou sans contrainte horaire |
| `fixe` | Déclenchée à une heure précise (`timeFixed: {h, m}`) |
| `ancré` | Déclenchée après un événement (`wake`, `after_lunch`, `before_sleep`) |

### 5.2 Par défaut
Les routines sans `type` défini héritent du type `libre` à la migration.

---

## 6. Profils de semaine

### 6.1 Structure d'un profil
Chaque profil définit, pour chaque domaine :
- `freq` : nombre de jours par semaine
- `duration` : durée en heures par occurrence

Les pourcentages idéaux sont calculés automatiquement depuis ces heures — ils ne sont jamais saisis directement.

### 6.2 Profils par défaut
Trois profils sont créés à l'initialisation :
- `p_actif` — Semaine active (📚)
- `p_vacances` — Vacances (🌴)
- `p_sprint` — Sprint / Concours (🎯)

### 6.3 Assignation
La table `weekTypeAssignments` associe un lundi (`YYYY-MM-DD`) à un `profileId`. Toute semaine non assignée utilise le profil actif par défaut.

---

## 7. Finances

### 7.1 Objets suivis
- Revenus (`incomes`)
- Dépenses (`expenses`)
- Objectifs d'épargne (`savingsGoals`)

### 7.2 Objectif d'épargne
Un objectif d'épargne contient : `id`, `name`, `cost`, `createdAt`. Il n'y a pas de notion de date cible obligatoire.

---

## 8. Santé

### 8.1 Quatre dimensions
```
sommeil     — qualité et durée du sommeil
activite    — exercice physique
nutrition   — alimentation
prevention  — prévention médicale / soins
```

### 8.2 Scores initiaux
Chaque dimension est initialisée à 70/100 en l'absence de données.

---

## 9. Persistance des données

### 9.1 Clé localStorage
Toutes les données sont stockées sous `boussole_v1_data`.

### 9.2 Règle de mutation
`saveData()` doit être appelé après **chaque mutation du state**. Aucune modification ne doit rester non persistée.

### 9.3 Migrations
Le chargement (`loadData()`) applique automatiquement les migrations nécessaires pour assurer la rétrocompatibilité (voir CLAUDE.md section Migrations).
