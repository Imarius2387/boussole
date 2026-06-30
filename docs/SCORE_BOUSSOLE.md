# SCORE_BOUSSOLE.md — Boussole Life OS

## Le Score Boussole

Ce document décrit en détail le calcul, l'interprétation et les limites du Score Boussole — le chiffre synthétique qui résume l'état d'alignement de l'utilisateur.

---

## 1. Définition

Le Score Boussole est un **indicateur composite sur 100** qui mesure à quel point l'utilisateur vit en accord avec ses intentions. Il agrège deux dimensions fondamentales :

1. **L'alignement** entre la vie voulue et la vie réelle
2. **La santé** sur ses 4 dimensions

---

## 2. Formule

```
Score Boussole = 0.6 × AlignementScore + 0.4 × SantéScore
```

### 2.1 AlignementScore
```
AlignementScore = 100 - (somme des écarts absolus entre % idéal et % réel) / 2
```

Calcul détaillé :
```js
function computeAlignmentScore(ideal, real) {
  const totalDeviation = Object.keys(ideal).reduce((sum, pillar) => {
    return sum + Math.abs((ideal[pillar] || 0) - (real[pillar] || 0));
  }, 0);
  return Math.max(0, 100 - totalDeviation / 2);
}
```

Exemple :
```
Idéal  : { professionnel: 40, personnel: 25, familial: 15, social: 20 }
Réel   : { professionnel: 60, personnel: 15, familial: 10, social: 15 }
Écarts : |60-40| + |15-25| + |10-15| + |15-20| = 20 + 10 + 5 + 5 = 40
AlignementScore = 100 - 40/2 = 80
```

### 2.2 SantéScore
```
SantéScore = (sommeil + activite + nutrition + prevention) / 4
```

Exemple :
```
{ sommeil: 80, activite: 60, nutrition: 70, prevention: 70 }
SantéScore = (80 + 60 + 70 + 70) / 4 = 70
```

### 2.3 Score final
```
Score = 0.6 × 80 + 0.4 × 70 = 48 + 28 = 76
```

---

## 3. Pondération et justification

| Composante | Poids | Justification |
|------------|-------|---------------|
| Alignement | 60% | L'alignement temps-valeurs est le cœur du concept Boussole |
| Santé | 40% | La santé est un prérequis à tout le reste, mais ne suffit pas seule |

La pondération 60/40 n'est pas symétrique intentionnellement : Boussole est avant tout un outil d'alignement de vie, pas un tracker de santé. La santé est nécessaire mais pas suffisante.

---

## 4. Interprétation du score

| Plage | Label | Signification |
|-------|-------|---------------|
| 85-100 | Excellent | Vie très alignée avec les intentions, santé au rendez-vous |
| 70-85 | Bien | Bon équilibre général, quelques ajustements possibles |
| 55-70 | Moyen | Déséquilibres notables, semaine à analyser |
| 40-55 | Fragile | Forte dérive, action recommandée |
| < 40 | Critique | Semaine hors norme, nécessite une réflexion |

---

## 5. Où est affiché le Score Boussole

### 5.1 Vue Maintenant (`view-now`)
Le score est affiché en position centrale dans la vue Maintenant, accompagné des tâches prioritaires. C'est la "homepage" de l'utilisateur.

### 5.2 Vue Équilibre (`view-balance`)
Les deux composantes (alignement et santé) sont détaillées pour permettre à l'utilisateur de comprendre ce qui tire le score vers le bas.

---

## 6. Fréquence de calcul

Le score est calculé **à la demande**, au moment du rendu de chaque vue. Il n'est pas persisté dans `state` — il est recalculé à partir de `state.blocks`, `state.healthScores`, et du profil de semaine actif.

---

## 7. Dépendances du score

Le score dépend de :
1. **`state.blocks`** → pour calculer le split réel de la semaine
2. **`state.weekProfiles` + `state.activeProfileId`** → pour calculer le split idéal
3. **`state.weekTypeAssignments`** → pour identifier le profil de la semaine courante
4. **`state.healthScores`** → pour le score santé

Si l'une de ces données est absente ou vide, le score peut être dégradé ou non calculable.

---

## 8. Limites actuelles

### 8.1 Données de santé manuelles
Le score santé repose sur des curseurs saisis manuellement. Il n'est pas encore connecté à des données réelles (qualité de sommeil effective, activité tracée). La composante santé peut donc être sur-estimée si l'utilisateur ne met pas à jour ses curseurs.

### 8.2 Semaines sans blocs agenda
Si l'utilisateur n'a posé aucun bloc agenda pour la semaine, le split réel est 0% sur tous les piliers. L'alignement est alors calculé contre 0, ce qui produit un score d'alignement très bas même si l'utilisateur a en réalité bien travaillé (sans l'avoir enregistré). **L'outil récompense la capture de données.**

### 8.3 Pas de pondération par pilier
Tous les piliers contribuent également à l'écart d'alignement. Un écart de 10% sur le pilier "familial" pèse autant qu'un écart de 10% sur "professionnel". Cette symétrie est intentionnelle mais peut être discutée.

---

## 9. Évolutions prévues

- **Connexion sleepQualityLog → score sommeil** : automatiser la composante sommeil depuis les notes de qualité journalières
- **Historique du score** : stocker le score hebdomadaire pour afficher une courbe d'évolution sur l'année
- **Notifications de dérive** : alerter l'utilisateur si le score chute sous un seuil pendant plusieurs jours
