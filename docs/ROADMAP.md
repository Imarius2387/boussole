# ROADMAP.md — Boussole Life OS

## Feuille de route

Ce document liste les priorités de développement, les fonctionnalités prévues et les décisions actées qui délimitent le périmètre du projet.

---

## Légende

| Symbole | Statut |
|---------|--------|
| ✅ | Implémenté et stable |
| 🔧 | Partiellement implémenté |
| 📋 | Prévu, non commencé |
| ❌ | Hors scope (décision actée) |

---

## Priorités immédiates

- [ ] **Tester sur iPhone Safari** — vérifier la persistance localStorage et l'absence de bugs d'affichage
- [ ] **Hébergement stable** — déployer sur GitHub Pages (recommandé)
- [ ] **Vérifier fermeture wizard sur mobile** — le wizard de profil doit se fermer proprement sur iOS

---

## Fonctionnalités V24 (actuelles)

### Core
- ✅ Système de piliers de vie (4 piliers, couleurs fixes)
- ✅ Profils de semaine avec wizard de configuration (freq × durée)
- ✅ Assignation de profils aux semaines (vue Année)
- ✅ Camemberts idéal vs réel
- ✅ Score Boussole (alignement 60% + santé 40%)
- ✅ Score d'alignement par pilier

### Agenda
- ✅ Vue Aujourd'hui avec 4 plages horaires fixes
- ✅ Ajout/édition/suppression de blocs
- ✅ Blocs de sommeil (coucher/réveil avec heures étendues)
- ✅ Blocs déjeuner

### Tâches & Objectifs
- ✅ Tâches avec 5 niveaux d'urgence
- ✅ Objectifs moyen et long terme par pilier
- ✅ Vue Maintenant (tâches prioritaires + score)

### Semaine & Année
- ✅ Vue Semaine narrative (phrase par jour + notes manuelles)
- ✅ Sélecteur de type de semaine
- ✅ Vue Année (grille 52 semaines, colorée par profil/pilier)
- ✅ Mode assignation sur la vue Année

### Routines
- ✅ Routines récurrentes (libre, fixe, ancré)
- ✅ Log quotidien des routines cochées

### Santé & Bien-être
- ✅ Score santé (4 dimensions, curseurs manuels)
- ✅ Objectif de sommeil (sleepTargetMinutes)
- ✅ Log de qualité du sommeil (1-5)
- ✅ Vue Suivi sommeil
- ✅ Vue Suivi santé

### Journal & Mémoire
- ✅ Journal quotidien (texte + photo)
- ✅ Notes de semaine (weekNotes)

### Finances & Projets
- ✅ Revenus et dépenses
- ✅ Objectifs d'épargne
- ✅ Gestion de projets (statut todo/doing/done)

---

## Backlog — Fonctionnalités identifiées

### Court terme (0-4 semaines)

| Fonctionnalité | Complexité | Modèle IA suggéré |
|----------------|------------|-------------------|
| Connexion sleepQualityLog → score sommeil | Faible | Sonnet 4.6 |
| Amélioration de l'UI mobile (touch targets) | Faible | Sonnet 4.6 |
| Persistance du score hebdomadaire dans state | Faible | Sonnet 4.6 |
| Export JSON des données | Faible | Sonnet 4.6 |

### Moyen terme (1-3 mois)

| Fonctionnalité | Complexité | Modèle IA suggéré |
|----------------|------------|-------------------|
| Horaires de coucher/lever différenciés par jour | Moyenne | Sonnet 4.6 |
| Graphique d'évolution du Score Boussole (historique) | Moyenne | Sonnet 4.6 |
| Modulation automatique de l'agenda selon le profil actif | Élevée | Opus 4.8 |
| Recommandations de routines selon l'énergie du jour | Élevée | Opus 4.8 |
| Audit mensuel guidé (rétrospective de vie) | Élevée | Opus 4.8 |

### Long terme (3 mois+)

| Fonctionnalité | Complexité | Modèle IA suggéré |
|----------------|------------|-------------------|
| Connexion données d'activité réelles → score activité | Élevée | Opus 4.8 |
| Analyse des patterns de déséquilibre sur l'année | Élevée | Opus 4.8 |
| Version SaaS avec backend (si demande) | Très élevée | Opus 4.8 |
| Synchronisation multi-appareils | Très élevée | Opus 4.8 |

---

## Décisions actées (ne pas remettre en question)

| Décision | Raison |
|----------|--------|
| Pas de framework JS | Portabilité maximale, zéro dépendance |
| Pas de backend | Hors scope pour l'instant |
| Pas de synchronisation multi-appareils | Nécessite un backend |
| Pas de score sur les tâches | L'urgence est le seul critère de tri |
| Court terme = tâches, pas goals | Simplification du modèle de données |
| Plages horaires fixes (6/12/14/18/0h) | Décision de conception UX actée |
| Le coucher reste sur viewedDate | Cohérence du modèle de données |
| 4 piliers fixes | Couvre 100% des sphères de vie d'un individu |

---

## Choix de modèle IA par type de tâche

### Haiku 4.5 — tâches légères
- Corriger du texte ou des commentaires dans le code
- Générer des micro-copies UI (labels, placeholders, messages d'erreur)
- Brainstorming rapide de noms ou d'idées

### Sonnet 4.6 — développement quotidien
- Modifier ou créer une vue (renderX)
- Ajouter une fonctionnalité dans l'IIFE
- Corriger un bug dans app.js, style.css ou index.html
- Créer ou mettre à jour un document de documentation
- Toute tâche de code vanilla sans architecture complexe

### Opus 4.7 — analyse stratégique
- Analyse concurrentielle d'outils de life OS
- Positionnement produit

### Opus 4.8 — raisonnement profond
- Concevoir le moteur de calcul du Score Boussole (formule, pondérations)
- Définir l'architecture d'un nouveau sous-système (ex : moteur de recommandation)
- Préparer une levée de fonds ou un pitch
- Audit mensuel complet du projet
- Business model et monétisation
- Arbitrages stratégiques (périmètre, pivot)
- MVP et roadmap long terme

---

## Changelog des versions majeures

### V24 (actuelle)
- Migration du système de score (urgence seule, pas d'importance/effort)
- Suppression des goals `horizon:'court'` → remplacés par tasks
- Système de profils de semaine avec wizard
- Refonte du score Boussole (alignement + santé)
- Correction du conflit CSS `.block` → `.btn.full`
- Heures étendues pour le coucher (startHour > 23)
- Vue Année avec mode assignation
