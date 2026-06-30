# PRODUCT_VISION.md — Boussole Life OS

## Identité du produit

**Boussole** est un système d'exploitation de vie (Life OS) personnel. Il ne s'agit pas d'un simple gestionnaire de tâches, ni d'un agenda, ni d'un tracker de productivité. C'est un outil de pilotage global qui permet à son utilisateur de maintenir un alignement conscient entre ce qu'il fait au quotidien et ce qui compte vraiment pour lui.

Le nom *Boussole* est intentionnel : l'outil ne décide pas à la place de l'utilisateur, il lui montre sa direction.

---

## Utilisateur cible

**Imanol Dupuy Muret**, 21 ans, Limoges.

Statut : étudiant-entrepreneur national. Profil caractéristique :
- Jongle entre plusieurs sphères de vie simultanément (études, projets pro, famille, vie sociale, santé)
- Ressent régulièrement un décalage entre ses intentions et ses actions réelles
- Capable de réflexion stratégique sur sa propre vie, mais manque d'un système pour matérialiser cette réflexion
- Autonome techniquement, exigeant sur la qualité et la cohérence du produit
- Utilise l'outil sur mobile et desktop (iPhone Safari prioritaire)

---

## Problème résolu

La plupart des outils de productivité répondent à la question *"Qu'est-ce que je dois faire ?"*. Boussole répond à la question *"Est-ce que je vis comme je veux vivre ?"*.

Sans Boussole :
- L'utilisateur sait qu'il a des tâches, des objectifs et un emploi du temps, mais ces trois couches ne sont jamais réconciliées
- Il passe des semaines entières en mode réactif sans s'en rendre compte
- Il n'a aucune vue de synthèse sur la répartition réelle de son temps entre ses piliers de vie
- Il ne peut pas détecter rapidement un déséquilibre (trop de professionnel, trop peu de personnel)

---

## Proposition de valeur

Boussole permet à son utilisateur de :

1. **Définir ses piliers de vie** et la répartition idéale de son temps entre eux
2. **Planifier ses semaines** selon des profils types (semaine active, vacances, sprint)
3. **Capturer ses tâches et objectifs** avec un système d'urgence simple et efficace
4. **Visualiser l'écart** entre la vie voulue et la vie réelle (camemberts idéal vs réel)
5. **Mesurer son alignement** via un score synthétique quotidien : le Score Boussole
6. **Prendre soin de sa santé** via 4 dimensions intégrées (sommeil, activité, nutrition, prévention)
7. **Garder une mémoire narrative** de ses semaines via le journal

---

## Philosophie technique

- **Zéro friction** : l'outil s'ouvre, on utilise, point. Pas d'onboarding répétitif, pas de chargements.
- **Zéro dépendance** : HTML/CSS/JS vanilla uniquement. Aucun framework, aucun backend.
- **Portabilité maximale** : un seul fichier `boussole_final.html` peut être ouvert n'importe où.
- **Persistance locale** : les données vivent dans `localStorage` sous la clé `boussole_v1_data`.
- **Pas de synchronisation cloud** (hors scope, décision actée).

---

## Périmètre actuel (V24)

### Dans le scope
- Gestion des 4 piliers de vie : professionnel, personnel, familial, social
- Système de profils de semaine avec wizard de configuration
- Agenda journalier avec 4 plages horaires fixes
- Vue semaine narrative + sélecteur de type de semaine
- Vue année (52 semaines, assignation de profils)
- Tâches avec 5 niveaux d'urgence (hour → month)
- Objectifs moyen et long terme par pilier
- Routines récurrentes (libre, fixe, ancré)
- Journal quotidien avec texte et photo
- Score Boussole (alignement + santé)
- Suivi santé (4 dimensions)
- Suivi sommeil (calculateur, qualité)
- Finances (revenus, dépenses, objectifs d'épargne)
- Projets

### Hors scope (décisions actées)
- Pas de synchronisation multi-appareils
- Pas de backend
- Pas de framework JS
- Pas de score sur les tâches (urgence uniquement)
- Pas d'objectifs court terme (= tâches)

---

## Vision long terme

Boussole a vocation à devenir le système de référence pour les étudiants-entrepreneurs et jeunes actifs qui refusent de choisir entre ambition et équilibre. L'outil devra un jour supporter :
- Des profils saisonniers modulant automatiquement l'agenda
- Un vrai moteur de recommandation de routines selon l'énergie du jour
- Une analyse rétrospective mensuelle (audit de vie guidé)
- Éventuellement une version SaaS avec backend si la demande le justifie
