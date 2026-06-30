# AI_ARCHITECTURE_RULES.md — Boussole Life OS

## Règles d'architecture pour les assistants IA

Ce document définit les contraintes techniques et les conventions de code que tout assistant IA doit respecter lorsqu'il travaille sur le projet Boussole. Il complète CLAUDE.md en fournissant des règles d'architecture approfondies.

---

## 1. Contraintes de stack (non négociables)

### 1.1 Vanilla uniquement
- HTML, CSS et JavaScript natifs uniquement
- **Interdit** : React, Vue, Svelte, Alpine, jQuery, Tailwind, Bootstrap, ou tout autre framework/library UI
- **Interdit** : TypeScript (le fichier `app.js` est du JS pur)
- **Interdit** : modules ES (`import`/`export`) — le code est une IIFE unique
- **Interdit** : tout appel réseau (fetch, axios, XMLHttpRequest) sauf pour des fonctionnalités explicitement demandées

### 1.2 Pas de backend
- Pas de Node.js, PHP, Python, ou autre serveur
- Pas de base de données externe
- Pas d'authentification
- Pas de WebSocket

### 1.3 Pas de build step
- Aucun bundler (webpack, vite, esbuild)
- Le code doit fonctionner directement dans un navigateur en ouvrant `boussole_final.html`

---

## 2. Structure du code JavaScript

### 2.1 IIFE obligatoire
Tout le code JavaScript est encapsulé dans une IIFE :
```js
(function() {
  // tout le code ici
})();
```

Les fonctions **ne sont pas globales**. On ne peut pas les appeler depuis la console ou un script externe.

### 2.2 State centralisé
`state` est l'unique source de vérité en mémoire. Toute modification passe par une mutation de `state` suivie d'un appel à `saveData()`.

```js
// Pattern correct
state.tasks.push(newTask);
saveData();
renderTasks();

// Pattern incorrect
localStorage.setItem('boussole_v1_data', JSON.stringify(newTask)); // jamais directement
```

### 2.3 Render functions
Chaque vue a sa propre fonction de rendu (`renderNow()`, `renderAgenda()`, etc.). Ces fonctions sont idempotentes : elles reconstruisent le DOM à partir de `state` à chaque appel. Il n'existe pas de mise à jour partielle du DOM dans une vue.

### 2.4 Taille du fichier
`app.js` fait environ 3700 lignes. Avant d'ajouter du code, toujours identifier précisément la section concernée. Éviter de dupliquer de la logique existante.

---

## 3. Fichiers du projet

| Fichier | Rôle | Taille indicative |
|---------|------|-------------------|
| `index.html` | Structure HTML statique (vues, modales, conteneurs) | ~800 lignes |
| `app.js` | Logique applicative complète (IIFE) | ~3700 lignes |
| `style.css` | Styles, variables CSS, thème dark | ~1500 lignes |
| `boussole_final.html` | Fusion des 3 fichiers — livrable final | ~6000 lignes |

### 3.1 Règle de fusion
Après chaque modification, les 3 fichiers doivent être fusionnés en `boussole_final.html`. L'ordre dans le fichier fusionné :
1. `<style>` contenant le contenu de `style.css`
2. Structure HTML de `index.html`
3. `<script>` contenant le contenu de `app.js`

### 3.2 Vérification syntaxe
Avant de livrer, toujours exécuter :
```bash
node --check app.js
```
Aucune erreur de syntaxe n'est acceptable.

---

## 4. CSS — conventions

### 4.1 Conflit `.block` (résolu en V24)
**Ne jamais utiliser la classe `.block` sur un bouton.** Elle entre en conflit avec les blocs agenda (positionnement absolu). Les boutons pleine largeur utilisent `.btn.full`.

```html
<!-- FAUX -->
<button class="btn block">Valider</button>

<!-- CORRECT -->
<button class="btn full">Valider</button>
```

### 4.2 Variables CSS
Utiliser exclusivement les variables définies dans `style.css` pour les couleurs, espacements et typographies. Ne pas coder de valeurs hexadécimales directement dans le HTML ou JS sauf pour les couleurs de piliers (qui sont des données).

### 4.3 Dark mode
Le thème dark est le thème par défaut. Toute nouvelle UI doit être testée avec les variables CSS existantes — elles gèrent automatiquement le contraste.

---

## 5. Navigation

### 5.1 Fonction de navigation
La navigation entre vues se fait exclusivement via `switchToView(name)`. Ne jamais manipuler `display` ou les classes directement pour changer de vue.

### 5.2 Identifiants de vues
```
view-balance   — Équilibre (vue par défaut)
view-now       — Maintenant
view-today     — Aujourd'hui
view-week      — Semaine
view-list      — Hub Tâches
view-tasks     — Liste des tâches
view-goals     — Objectifs
view-more      — Menu Plus
year           — Année
projects       — Projets
finance        — Finances
foundations    — Fondations
medical        — Suivi santé
sleep-tracking — Suivi sommeil
help           — Aide
```

---

## 6. Gestion des modales

### 6.1 Ouverture
Les modales sont ouvertes via des fonctions dédiées (`openBlockEditor()`, etc.). Ne pas afficher une modale en manipulant directement le DOM.

### 6.2 Fermeture
Toujours prévoir la fermeture via :
- Un bouton "Annuler" / "Fermer" explicite
- Le clic sur le fond (backdrop)
- La touche Escape

---

## 7. Règles pour les assistants IA

### 7.1 Avant de coder
1. Lire CLAUDE.md en priorité
2. Identifier précisément le fichier et la fonction concernés
3. Vérifier qu'aucune autre fonction n'est impactée
4. Signaler tout risque de régression

### 7.2 Pendant le codage
- Ne pas ajouter de dépendances externes
- Ne pas créer de fonctions globales
- Ne pas bypasser `saveData()`
- Ne pas utiliser `.block` sur un bouton
- Respecter les conventions de nommage existantes

### 7.3 Après avoir codé
1. Confirmer que `node --check app.js` passe sans erreur
2. Lister exactement ce qui a changé et pourquoi
3. Signaler ce qu'il faudra tester manuellement (iPhone Safari en priorité)
4. Produire le fichier `boussole_final.html` fusionné

### 7.4 Ce qu'un assistant IA ne doit jamais faire
- Suggérer d'ajouter React, Vue ou tout framework
- Créer des fichiers supplémentaires (un seul livrable)
- Modifier le schéma de données sans documenter la migration
- Supprimer des fonctionnalités existantes sans ordre explicite
- Ignorer les règles de fusion et de vérification syntaxique
