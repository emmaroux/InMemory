# Documentation Technique - InMemory
*Dernière mise à jour : 19 mars 2024*

## Table des matières
- [Description du Projet](#description-du-projet)
- [1. Choix Technologiques](#1-choix-technologiques)
  - [1.1 Backend - Strapi](#11-backend---strapi)
  - [1.2 Structure des Collections Strapi](#12-structure-des-collections-strapi)
  - [1.3 Permissions et Rôles](#13-permissions-et-rôles)
  - [1.4 API Endpoints](#14-api-endpoints)
- [2. Configuration de l'Environnement](#2-configuration-de-lenvironnement)
  - [2.1 Installation de Strapi](#21-installation-de-strapi)
  - [2.2 Configuration de la Base de Données](#22-configuration-de-la-base-de-données)
- [3. Déploiement](#3-déploiement)
- [4. Sécurité](#4-sécurité)
- [5. Maintenance et Monitoring](#5-maintenance-et-monitoring)
- [6. Évolution Future](#6-évolution-future)

## Description du Projet

InMemory est une plateforme web permettant aux utilisateurs de partager et de voter pour des ressources d'information. Le projet vise à créer une communauté autour de la veille informationnelle, où les utilisateurs peuvent :

- Partager des ressources (liens, images, descriptions)
- Voter pour les meilleures ressources
- Créer et rejoindre des équipes
- Classifier les votes par équipe

### Objectifs Principaux
1. Créer une interface simple et intuitive pour le partage de ressources
2. Permettre une organisation collective du contenu par équipes
3. Faciliter la découverte de ressources pertinentes
4. Préparer le terrain pour une future application mobile

### Fonctionnalités Clés
- Ajout de contenu depuis un navigateur (Chrome)
- Récupération automatique des métadonnées (titre, image)
- Affichage en mode galerie
- Système d'invitation d'amis
- Authentification des utilisateurs
- Système de vote avec classification par équipes

## 1. Choix Technologiques

### 1.1 Backend - Strapi
**Pourquoi Strapi ?**
- **Rapidité de développement :** API REST et GraphQL prêtes à l'emploi
- **Interface d'administration intégrée :** Facilite la gestion du contenu et des utilisateurs
- **Gestion des médias :** Système intégré pour le stockage et la gestion des images
- **Authentification :** Système d'authentification prêt à l'emploi
- **Extensibilité :** Possibilité d'ajouter des plugins et de personnaliser le comportement
- **Préparation mobile :** API immédiatement utilisable pour le développement d'applications mobiles

### 1.2 Structure des Collections Strapi

#### Users (Géré par défaut)
- Extensions possibles :
  - Ajout d'un champ `teams` (relation many-to-many)
  - Ajout d'un champ `role` (admin, user, etc.)

#### Resources
- Champs :
  - `title` (string)
  - `url` (string)
  - `image` (media)
  - `description` (text)
  - `createdBy` (relation one-to-many avec Users)
  - `votes` (relation one-to-many avec Votes)

#### Teams
- Champs :
  - `name` (string)
  - `members` (relation many-to-many avec Users)
  - `resources` (relation many-to-many avec Resources)

#### Votes
- Champs :
  - `user` (relation one-to-many avec Users)
  - `resource` (relation one-to-many avec Resources)
  - `team` (relation one-to-many avec Teams)
  - `createdAt` (datetime)

### 1.3 Permissions et Rôles

#### Rôles
1. **Public**
   - Lecture des ressources
   - Création de compte

2. **Authentifié**
   - Toutes les permissions de Public
   - Création de ressources
   - Vote sur les ressources
   - Gestion de ses propres ressources

3. **Admin**
   - Toutes les permissions
   - Gestion des utilisateurs
   - Gestion de toutes les ressources

### 1.4 API Endpoints

#### Authentication
- `POST /auth/local/register` - Création de compte
- `POST /auth/local` - Connexion
- `GET /users/me` - Informations de l'utilisateur connecté

#### Resources
- `GET /resources` - Liste des ressources
- `POST /resources` - Création d'une ressource
- `GET /resources/:id` - Détails d'une ressource
- `PUT /resources/:id` - Modification d'une ressource
- `DELETE /resources/:id` - Suppression d'une ressource

#### Teams
- `GET /teams` - Liste des équipes
- `POST /teams` - Création d'une équipe
- `GET /teams/:id` - Détails d'une équipe

#### Votes
- `POST /votes` - Création d'un vote
- `GET /votes` - Liste des votes

## 2. Configuration de l'Environnement

### 2.1 Installation de Strapi

1. Créer le dossier du projet backend :
```bash
mkdir inmemory-backend
cd inmemory-backend
```

2. Installer Strapi :
```bash
npx create-strapi-app@latest .
```

3. Répondre aux questions de configuration :
   - Installation type : Quickstart
   - Language : JavaScript
   - Database client : postgres
   - Database name : inmemory
   - Host : 127.0.0.1
   - Port : 5432
   - Username : postgres
   - Password : [votre mot de passe]
   - SSL : No

4. Démarrer le serveur de développement :
```bash
npm run develop
```

5. Créer un compte administrateur :
   - Accéder à http://localhost:1337/admin
   - Suivre les instructions pour créer le premier compte administrateur

### 2.2 Configuration de la Base de Données

1. Installer PostgreSQL si ce n'est pas déjà fait
2. Créer une base de données :
```sql
CREATE DATABASE inmemory;
```

3. Configurer les variables d'environnement dans `.env` :
```
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=inmemory
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=votre_mot_de_passe
```

## 3. Déploiement

### 3.1 Options de Déploiement
- Railway (recommandé)
- Heroku
- DigitalOcean

### 3.2 Configuration de la Base de Données
- Utilisation de PostgreSQL
- Configuration des variables d'environnement
- Sauvegarde automatique

## 4. Sécurité

### 4.1 Mesures de Sécurité
- Validation des entrées
- Protection CSRF
- Rate limiting
- Sanitization des données

### 4.2 Bonnes Pratiques
- Utilisation de variables d'environnement
- Mise à jour régulière des dépendances
- Backup régulier de la base de données

## 5. Maintenance et Monitoring

### 5.1 Monitoring
- Logs d'erreurs
- Performance monitoring
- Usage statistics

### 5.2 Maintenance
- Backup régulier
- Mise à jour de sécurité
- Nettoyage des données inactives

## 6. Évolution Future

### 6.1 Optimisations Possibles
- Mise en cache
- CDN pour les médias
- Optimisation des requêtes

### 6.2 Scalabilité
- Load balancing
- Base de données en cluster
- Microservices si nécessaire 