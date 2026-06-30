# LIFE_BALANCE_ENGINE.md — Boussole Life OS

## Moteur d'équilibre de vie

Ce document décrit le fonctionnement du système de piliers, de profils de semaine, de camemberts et de calcul d'alignement — le cœur du concept Boussole.

---

## 1. Les piliers de vie

Boussole structure la vie en 4 piliers :

| Pilier | Code | Couleur |
|--------|------|---------|
| Professionnel | `professionnel` | #7B77D4 (violet) |
| Personnel | `personnel` | #6EBF8B (vert sauge) |
| Familial | `familial` | #F59E0B (orange) |
| Social | `social` | #EC4899 (rose) |

Ces piliers sont fixes. Chaque tâche, bloc agenda, objectif et routine est rattaché à l'un d'eux.

---

## 2. Profils de semaine

### 2.1 Concept
Un profil de semaine définit **comment l'utilisateur veut idéalement répartir son temps** sur un type de semaine donné. Il ne s'agit pas de pourcentages arbitraires : chaque profil est défini par des heures concrètes.

### 2.2 Structure d'un profil
```js
{
  id: 'p_actif',
  name: 'Semaine active',
  icon: '📚',
  domains: {
    professionnel: { freq: 5, duration: 7 },  // 5 jours × 7h = 35h
    personnel:     { freq: 4, duration: 1.5 }, // 4 jours × 1.5h = 6h
    familial:      { freq: 3, duration: 2 },   // 3 jours × 2h = 6h
    social:        { freq: 2, duration: 3 }    // 2 jours × 3h = 6h
  }
}
```

### 2.3 Calcul des heures par domaine
```js
function profileHoursPerWeek(profile) {
  // Pour chaque domaine : freq × duration = heures/semaine
  return Object.fromEntries(
    Object.entries(profile.domains).map(([d, v]) => [d, v.freq * v.duration])
  );
}
// Résultat : { professionnel: 35, personnel: 6, familial: 6, social: 6 }
```

### 2.4 Conversion en pourcentages
```js
function hoursToPercents(hours) {
  const total = Object.values(hours).reduce((a, b) => a + b, 0);
  return Object.fromEntries(
    Object.entries(hours).map(([d, h]) => [d, Math.round(h / total * 100)])
  );
}
// Résultat : { professionnel: 66, personnel: 11, familial: 11, social: 11 }
```

**Règle fondamentale** : Les pourcentages idéaux ne sont jamais saisis directement. Ils sont toujours calculés depuis les heures réelles.

### 2.5 Profils par défaut
| ID | Nom | Icône |
|----|-----|-------|
| `p_actif` | Semaine active | 📚 |
| `p_vacances` | Vacances | 🌴 |
| `p_sprint` | Sprint / Concours | 🎯 |

---

## 3. Assignation des semaines

### 3.1 Mécanisme
La table `weekTypeAssignments` associe le lundi d'une semaine (format `YYYY-MM-DD`) à un `profileId` :
```js
weekTypeAssignments: {
  '2026-06-22': 'p_actif',
  '2026-07-06': 'p_vacances'
}
```

### 3.2 Profil actif
`state.activeProfileId` désigne le profil actif par défaut pour les semaines non assignées.

### 3.3 Vue Année
La vue Année (`view-year`) affiche une grille de 52 semaines. Chaque semaine est colorée selon :
1. Le profil assigné (si existant)
2. Le pilier dominant des blocs de la semaine (si pas de profil)

Un mode "Assigner" permet de sélectionner un profil puis de cliquer/balayer sur les semaines pour les assigner.

---

## 4. Les camemberts

### 4.1 Camembert idéal
Représente la répartition voulue, calculée depuis le profil de semaine actif.

**Fonction** : `drawPie(svgId, data)` — dessine un camembert SVG depuis des données de pourcentages par pilier.

### 4.2 Camembert réel
Représente la répartition réelle calculée depuis les blocs agenda de la semaine en cours.

**Fonction** : `computeRealSplit()` — analyse les blocs de `state.blocks` pour la semaine affichée et calcule les minutes par pilier.

```js
function computeRealSplit() {
  // 1. Filtre les blocs de la semaine (lundi → dimanche)
  // 2. Exclut les blocs sommeil et déjeuner (isSleepBlock, isLunchBlock)
  // 3. Additionne les durationMinutes par pilier
  // 4. Convertit en pourcentages
  return { professionnel: 45, personnel: 20, familial: 15, social: 20 }
}
```

### 4.3 Affichage
Les deux camemberts sont affichés côte à côte dans la vue Équilibre (`view-balance`) :
- Gauche : idéal (calculé depuis le profil actif)
- Droite : réel (calculé depuis l'agenda de la semaine)

---

## 5. Score d'alignement

### 5.1 Définition
L'alignement mesure l'écart entre la répartition voulue et la répartition réelle.

```js
function computeAlignmentScore(ideal, real) {
  // ideal et real sont des objets { pilier: pourcentage }
  const totalDeviation = Object.keys(ideal).reduce((sum, pillar) => {
    return sum + Math.abs((ideal[pillar] || 0) - (real[pillar] || 0));
  }, 0);
  return Math.max(0, 100 - totalDeviation / 2);
}
```

**Formule** : `AlignementScore = 100 - (somme des écarts absolus) / 2`

**Exemples** :
- Aucun écart → score 100
- 20 points d'écart par pilier (4 piliers) = 80 points totaux → score 60
- Tous à 0% vs tous à 25% = 100 points d'écart → score 50

### 5.2 Interprétation
| Score | Signification |
|-------|---------------|
| 80-100 | Excellente semaine, en ligne avec les intentions |
| 60-80 | Bonne semaine, quelques déséquilibres mineurs |
| 40-60 | Semaine déséquilibrée, à corriger |
| < 40 | Forte dérive, attention requise |

---

## 6. Wizard de configuration de profil

### 6.1 Objectif
Le wizard guide l'utilisateur pour configurer les heures réelles de chaque domaine dans un profil.

### 6.2 Fonctions
- `startWizard(profile)` — initialise et affiche la première étape
- `renderWizardStep()` — affiche l'étape courante
- `ensureProfiles()` — crée les profils par défaut si absents

### 6.3 Étapes du wizard
1. Introduction : nom et icône du profil
2. Pour chaque domaine : fréquence (jours/semaine) + durée (h/occurrence)
3. Récapitulatif : affichage du camembert résultant avant validation

---

## 7. Vue Semaine

### 7.1 Planning narratif
Pour chaque jour de la semaine :
- Auto-généré depuis le bloc le plus long du jour (hors sommeil/déjeuner)
- Modifiable manuellement au clic (stocké dans `state.weekNotes`)

### 7.2 Sélecteur de type
En haut de la vue Semaine, un sélecteur permet d'assigner un profil à la semaine affichée. Ce choix est immédiatement reflété dans `weekTypeAssignments` et le camembert idéal.
