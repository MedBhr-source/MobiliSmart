# Mobilismart - Mobilité Urbaine Intelligente

> Application web (PWA) de mobilité urbaine intelligente permettant aux citoyens de planifier leurs déplacements quotidiens en combinant plusieurs modes de transport avec une IA qui prédit l'affluence.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Laravel](https://img.shields.io/badge/Backend-Laravel%2011-red)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black)
![FastAPI](https://img.shields.io/badge/AI-FastAPI-green)
![Docker](https://img.shields.io/badge/Infra-Docker-blue)

---

## Table des matières

- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Services](#-services)
- [API Endpoints](#-api-endpoints)
- [Structure du projet](#-structure-du-projet)
- [Développement](#-développement)
- [Troubleshooting](#-troubleshooting)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Frontend      │     │   Backend       │     │   AI Service     │
│   Next.js 14    │────▶│   Laravel 11    │────▶│   FastAPI        │
│   React + TS    │◀────│   Octane/Swoole │◀────│   scikit-learn   │
│   Tailwind CSS  │     │   Sanctum Auth  │     │   XGBoost        │
└─────────────────┘     └────────┬────────┘     └──────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              ┌─────┴─────┐ ┌───┴────┐ ┌────┴─────┐
              │ PostgreSQL│ │ Redis  │ │  Nginx   │
              │ + PostGIS │ │ Cache  │ │  Proxy   │
              └───────────┘ └────────┘ └──────────┘
```

---

## Stack technique

| Composant       | Technologie                   | Version  |
| --------------- | ----------------------------- | -------- |
| Backend         | Laravel + Octane (Swoole)     | 11.x     |
| Frontend        | Next.js + React + TypeScript  | 14.x     |
| Styling         | Tailwind CSS                  | 3.4+     |
| IA/ML           | Python FastAPI + scikit-learn | 3.11+    |
| Base de données | PostgreSQL + PostGIS          | 15+      |
| Cache/Queue     | Redis                         | 7+       |
| Auth            | Laravel Sanctum + Socialite   | SPA mode |
| Conteneurs      | Docker & Docker Compose       | Latest   |

---

## Prérequis

- **Docker** et **Docker Compose** installés
- **Git**
- (Optionnel) Clé API **Mapbox** pour la carte interactive
- (Optionnel) Clé API **Google OAuth** pour l'authentification sociale

---

## Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd mobiliSmart
```

### 2. Configurer l'environnement

```bash
cp .env.example .env
# Éditer .env avec vos clés API (Mapbox, Google OAuth, etc.)
```

### 3. Lancer avec Docker Compose

```bash
docker-compose up -d --build
```

### 4. Initialiser le backend

```bash
# Générer la clé Laravel
docker-compose exec backend php artisan key:generate

# Lancer les migrations
docker-compose exec backend php artisan migrate

# Peupler avec les données de démo (métro Paris, stations vélo, etc.)
docker-compose exec backend php artisan db:seed
```

### 5. Accéder à l'application

| Service           | URL                       |
| ----------------- | ------------------------- |
| **Frontend**      | http://localhost:3000     |
| **Backend API**   | http://localhost:8000/api |
| **AI Service**    | http://localhost:8001     |
| **Nginx (Proxy)** | http://localhost          |

### Compte démo

```
Email: demo@mobilismart.app
Mot de passe: password
```

---

## Services

### Backend — Laravel 11

- API REST avec Sanctum (auth SPA)
- Octane/Swoole pour les performances
- Service de planification d'itinéraires multimodaux
- Calcul d'empreinte carbone
- Cache Redis pour les données transit

### Frontend — Next.js 14

- App Router avec TypeScript
- Tailwind CSS + glassmorphism design
- Framer Motion pour les animations
- Mapbox GL JS pour la cartographie
- PWA avec manifest et service worker
- Zustand pour le state management

### AI Service — FastAPI

- Prédiction d'affluence (1-5) par GradientBoosting
- Estimation des temps de trajet (ETA)
- Entraînement automatique au démarrage
- API REST documentée (Swagger à /docs)

---

## API Endpoints

### Authentification

| Méthode | Endpoint             | Description  |
| ------- | -------------------- | ------------ |
| POST    | `/api/auth/register` | Inscription  |
| POST    | `/api/auth/login`    | Connexion    |
| POST    | `/api/auth/logout`   | Déconnexion  |
| GET     | `/api/auth/google`   | OAuth Google |

### Transport

| Méthode | Endpoint                     | Description           |
| ------- | ---------------------------- | --------------------- |
| GET     | `/api/transit/lines`         | Lignes de transport   |
| GET     | `/api/transit/stops/nearby`  | Arrêts à proximité    |
| GET     | `/api/transit/alerts`        | Alertes en cours      |
| GET     | `/api/bikes/stations/nearby` | Stations vélo proches |

### Itinéraires

| Méthode | Endpoint               | Description         |
| ------- | ---------------------- | ------------------- |
| POST    | `/api/routes/plan`     | Planifier un trajet |
| GET     | `/api/routes/saved`    | Favoris             |
| POST    | `/api/trips`           | Créer un trajet     |
| GET     | `/api/stats/dashboard` | Tableau de bord     |

### IA

| Méthode | Endpoint            | Description          |
| ------- | ------------------- | -------------------- |
| POST    | `/ai/predict/crowd` | Prédiction affluence |
| POST    | `/ai/predict/eta`   | Estimation durée     |
| GET     | `/ai/health`        | Santé du service     |

---

## Structure du projet

```
mobiliSmart/
├── docker-compose.yml          # Orchestration des services
├── .env.example                # Configuration
│
├── backend/                    # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # Contrôleurs REST
│   │   ├── Models/                 # Modèles Eloquent
│   │   ├── Services/               # Logique métier
│   │   └── Providers/
│   ├── config/                     # Configuration Laravel
│   ├── database/
│   │   ├── migrations/             # Schéma BDD
│   │   └── seeders/                # Données de démo
│   └── routes/api.php              # Routes API
│
├── frontend/                   # Next.js 14 App
│   ├── src/
│   │   ├── app/                    # Pages (App Router)
│   │   │   ├── page.tsx            # Accueil
│   │   │   ├── plan/               # Planificateur
│   │   │   ├── live/               # Temps réel
│   │   │   ├── dashboard/          # Tableau de bord
│   │   │   ├── login/              # Authentification
│   │   │   └── profile/            # Profil & préférences
│   │   └── lib/                    # API client, types, utils
│   └── public/manifest.json        # PWA manifest
│
├── ai-service/                 # FastAPI ML Service
│   ├── app/
│   │   ├── main.py                 # Entry point
│   │   ├── routers/                # Endpoints
│   │   ├── models/                 # Pydantic schemas
│   │   └── services/               # ML model manager
│   └── requirements.txt
│
└── docker/                     # Docker configs
    ├── nginx/default.conf
    └── postgres/init.sql
```

---

## Variables d'environnement clés

| Variable                   | Description                |
| -------------------------- | -------------------------- |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Token Mapbox pour la carte |
| `GOOGLE_CLIENT_ID`         | OAuth Google (optionnel)   |
| `DB_PASSWORD`              | Mot de passe PostgreSQL    |
| `AI_SERVICE_URL`           | URL du service IA          |

---

## Développement

### Logs & Debugging

```bash
# Voir tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ai-service
```

### Commandes utiles

```bash
# Redémarrer un service
docker-compose restart backend

# Accéder au shell du backend
docker-compose exec backend bash

# Accéder au shell de la BDD
docker-compose exec postgres psql -U mobilismart -d mobilismart

# Vider Redis
docker-compose exec redis redis-cli FLUSHALL

# Arrêter tout
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

### Mode développement

```bash
# Hot reload activé par défaut
# Frontend: Next.js détecte les changements automatiquement
# Backend: Octane surveille les fichiers (config/octane.php)
# AI Service: Uvicorn en mode reload
```

---

## Troubleshooting

### Backend ne démarre pas

```bash
# Régénérer la clé Laravel
docker-compose exec backend php artisan key:generate

# Vérifier les permissions storage
docker-compose exec backend chmod -R 775 storage bootstrap/cache

# Vérifier les migrations
docker-compose exec backend php artisan migrate:status
```

### Frontend affiche une page blanche

```bash
# Nettoyer le cache Next.js
docker-compose exec frontend rm -rf .next

# Redémarrer le service
docker-compose restart frontend
```

### Problèmes de connexion à la BDD

```bash
# Vérifier la connectivité PostgreSQL
docker-compose exec backend php artisan tinker
# Dans tinker: DB::connection()->getPdo()

# Vérifier les variables d'environnement
docker-compose exec backend env | grep DB_
```

### Erreur PostGIS

```bash
# Activez l'extension PostGIS
docker-compose exec postgres psql -U mobilismart -d mobilismart -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### Service IA ne répond pas

```bash
# Vérifier la santé
curl http://localhost:8001/api/health

# Accéder aux logs
docker-compose logs -f ai-service
```

---

## Contribution

Les contributions sont les bienvenues ! Voici comment participer :

### 1. Fork et Clone

```bash
git clone https://github.com/YOUR_USERNAME/mobiliSmart.git
cd mobiliSmart
git remote add upstream https://github.com/ORIGINAL_REPO/mobiliSmart.git
```

### 2. Créer une branche

```bash
# Basé sur main
git checkout -b feature/votre-feature
# ou
git checkout -b bugfix/votre-bugfix
```

### 3. Standards de code

- **Backend (PHP)**: PSR-12, Laravel conventions
- **Frontend (TS)**: ESLint + Prettier (config incluse)
- **AI (Python)**: PEP 8, type hints recommandés

### 4. Commit et Push

```bash
git add .
git commit -m "feat: description claire de la modification"
git push origin feature/votre-feature
```

### 5. Pull Request

Créez une PR avec :

- Titre clair et concis
- Description détaillée des changements
- Références aux issues associées (#123)
- Tests validés localement

### Styles de commits

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage, lint
refactor: restructuration du code
test: ajout/modification de tests
chore: dépendances, configuration
```

---

## Licence

MIT - Mobilismart © 2026
