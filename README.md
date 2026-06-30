# Boussole — Life OS

Application web statique de gestion de vie personnelle.
Données stockées dans le localStorage du navigateur.

## Démarrage rapide

```bash
npm install
npm run dev
```
Puis ouvrir http://localhost:3000

## Structure

```
boussole/
  index.html   — structure HTML complète
  app.js       — toute la logique applicative (~3700 lignes)
  style.css    — tous les styles (~39k chars)
  CONTEXTE.md  — architecture et décisions techniques
```

## Stack

- HTML/CSS/JS vanilla — aucun framework
- localStorage pour la persistance
- Tabler Icons (CDN) + Google Fonts (CDN)
- Hébergeable sur GitHub Pages, Netlify, tiiny.host
