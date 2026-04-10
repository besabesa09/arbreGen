# ArbreGen

Application Express.js pour gerer un arbre genealogique par utilisateur avec MongoDB.

## Fonctionnalites

- connexion simple par pseudo ou prenom
- un arbre genealogique distinct par utilisateur
- ajout de partenaire et d'enfants
- modification de nom
- suppression de partenaire ou de branche complete
- apercu visuel de tout l'arbre
- export PDF de l'arbre
- documentation Swagger des endpoints

## Stack

- Express.js
- MongoDB avec Mongoose
- frontend statique HTML/CSS/JavaScript
- Swagger UI

## Installation

```bash
npm install
```

## Configuration

1. Copier `.env.example` vers `.env`
2. Verifier la connexion MongoDB

Exemple :

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/arbreGen
```

La base utilise le nom `arbreGen`.

## Demarrage

```bash
npm run dev
```

ou

```bash
npm start
```

## URLs

- application : `http://localhost:3000`
- swagger : `http://localhost:3000/api-docs`

## Deploiement Render

Le projet est pret pour un deploiement Render avec le fichier `render.yaml`.

### Variables Render a definir

- `MONGO_URI`
- `NODE_ENV=production` est deja prevu dans `render.yaml`

### Etapes conseillees

1. pousser le projet sur GitHub
2. creer un `Web Service` Render depuis le repository
3. verifier que Render detecte bien `render.yaml`
4. definir la variable secrete `MONGO_URI` avec une URI MongoDB accessible depuis Internet
5. lancer le deploiement

### Important

- ne pas utiliser une URI MongoDB locale `127.0.0.1` sur Render
- pour Render, utiliser de preference MongoDB Atlas ou un serveur Mongo accessible publiquement
- l'URL de healthcheck est `/api/health`
