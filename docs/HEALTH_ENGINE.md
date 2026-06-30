# HEALTH_ENGINE.md — Boussole Life OS

## Moteur de santé

Ce document décrit le sous-système de suivi de la santé dans Boussole : les 4 dimensions, le suivi sommeil, et leur intégration dans le Score Boussole.

---

## 1. Les 4 dimensions de santé

### 1.1 Définition
La santé est mesurée selon 4 dimensions indépendantes, chacune sur une échelle de 0 à 100 :

| Dimension | Code | Description |
|-----------|------|-------------|
| Sommeil | `sommeil` | Qualité et durée du sommeil |
| Activité | `activite` | Exercice physique et mouvement |
| Nutrition | `nutrition` | Alimentation et hydratation |
| Prévention | `prevention` | Soins médicaux, dépistage, prévention |

### 1.2 Valeurs par défaut
En l'absence de données, chaque dimension est initialisée à 70/100. Ce n'est pas un score "neutre" : il représente un état "assez bien" mais perfectible.

### 1.3 Structure dans le state
```js
state.healthScores = {
  sommeil:    70,
  activite:   70,
  nutrition:  70,
  prevention: 70
}
```

### 1.4 Saisie
Les scores sont saisis manuellement via des curseurs dans la vue Fondations ou Suivi santé. Il n'y a pas encore de calcul automatique depuis les données réelles.

---

## 2. Suivi du sommeil

### 2.1 Objectif de sommeil
L'utilisateur définit sa durée cible de sommeil en minutes :
```js
state.sleepTargetMinutes = 480  // 8 heures par défaut
```

### 2.2 Log de qualité du sommeil
Un journal de qualité permet de noter son sommeil chaque matin sur une échelle de 1 à 5 :
```js
state.sleepQualityLog = {
  '2026-06-23': 4,
  '2026-06-22': 3
}
```

### 2.3 Blocs de sommeil dans l'agenda
Le calculateur sommeil pose deux blocs dans l'agenda :
- **Bloc coucher** : posé sur `viewedDate`, avec `isSleepBlock: true`
- **Bloc réveil** : posé sur `viewedDate + 1`, avec `isSleepBlock: true`

#### Règle importante sur les heures étendues
Pour permettre le tri chronologique correct, `startHour` peut dépasser 23 :
- `startHour: 22` = 22h00
- `startHour: 24` = 0h00 (minuit)
- `startHour: 25` = 1h00
- `startHour: 26` = 2h00

**Le coucher reste toujours posé sur `viewedDate`**, même si l'heure dépasse minuit. Le réveil est posé sur `sleepWakeDate` (qui peut être J+1).

#### Propriétés des blocs sommeil
```js
{
  isSleepBlock: true,
  sleepSessionId: 'session_123',    // lien coucher ↔ réveil
  sleepWakeDate: '2026-06-24',      // date du réveil
  totalSleepMinutes: 450            // durée totale calculée
}
```

### 2.4 Calcul de la durée de sommeil
```
durée réelle = totalSleepMinutes
écart = durée réelle - sleepTargetMinutes
```

### 2.5 Score sommeil (évolution prévue)
Actuellement, le score `sommeil` est saisi manuellement. L'intention est de le connecter automatiquement au `sleepQualityLog` :
```
score_nuit = qualité × 20  (1→20, 5→100)
score_sommeil = moyenne des 7 derniers jours
```
**Cette connexion n'est pas encore implémentée.**

---

## 3. Score Santé global

### 3.1 Calcul
```js
function computeHealthScore() {
  const scores = state.healthScores;
  return (scores.sommeil + scores.activite + scores.nutrition + scores.prevention) / 4;
}
```

Le score santé est la **moyenne simple** des 4 dimensions. Toutes les dimensions ont le même poids.

### 3.2 Plage
- Minimum : 0
- Maximum : 100
- Valeur initiale : 70 (moyenne des 4 dimensions à 70)

---

## 4. Vue Fondations

La vue Fondations (`foundations`) affiche :
- Les 4 curseurs de santé, modifiables en temps réel
- L'historique de qualité de sommeil
- Les routines associées à la santé

---

## 5. Vue Suivi santé (`medical`)

Accessible depuis le menu Plus :
- Vue détaillée des 4 dimensions
- Graphiques d'évolution dans le temps (si données disponibles)

---

## 6. Vue Suivi sommeil (`sleep-tracking`)

Accessible depuis le menu Plus :
- Historique des sessions de sommeil
- Durées réelles vs objectif
- Journal de qualité

---

## 7. Limites actuelles et pistes d'évolution

### 7.1 Ce qui n'est pas encore implémentée
- Connexion automatique `sleepQualityLog` → score `sommeil`
- Connexion données d'activité réelles → score `activite`
- Alertes ou notifications en cas de score dégradé plusieurs jours consécutifs
- Différenciation des horaires de coucher selon les jours de la semaine (weekday vs weekend)

### 7.2 Décisions actées
- Les 4 dimensions ont toujours le même poids dans le score santé
- Le score santé contribue au Score Boussole à hauteur de 40%
- La saisie manuelle est conservée tant que la connexion automatique n'est pas implémentée
