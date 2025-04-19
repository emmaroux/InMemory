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
  - [2.1 Prérequis](#21-prérequis)
  - [2.2 Configuration de PostgreSQL](#22-configuration-de-postgresql)
  - [2.3 Installation de Strapi](#23-installation-de-strapi)
- [3. Déploiement](#3-déploiement)
- [4. Sécurité](#4-sécurité)
- [5. Maintenance et Monitoring](#5-maintenance-et-monitoring)
- [6. Évolution Future](#6-évolution-future)

## Description du Projet

## 1. Choix Technologiques

### 1.1 Backend - Strapi

1. Créer le dossier du projet backend :
```bash
mkdir inmemory-backend
cd inmemory-backend
```

### 2.1 Prérequis

Avant d'installer Strapi, il est **impératif** d'avoir installé et configuré PostgreSQL. 

### 2.2 Configuration de PostgreSQL

1. **Installation de PostgreSQL** :
   ```bash
   # Installation via Homebrew
   brew install postgresql@14
   
   # Démarrage du service
   brew services start postgresql@14
   ```

2. **Configuration de l'utilisateur PostgreSQL** :
   - Par défaut, PostgreSQL crée un utilisateur nommé "postgres"
   - Pour définir un mot de passe pour cet utilisateur :
   ```bash
   psql postgres
   \password postgres
   ```
   - Entrez le mot de passe que vous souhaitez utiliser

3. **Création de la base de données** :
   ```bash
   createdb inmemory
   ```

4. **Vérification de la connexion** :
   ```bash
   psql -U postgres -d inmemory
   ```

5. **Dépannage** :
   - Si l'installation est interrompue (perte de connexion, erreur) :
     ```bash
     # Arrêter tous les processus PostgreSQL
     brew services stop postgresql@14
     
     # Désinstaller PostgreSQL
     brew uninstall postgresql@14
     
     # Réinstaller proprement
     brew install postgresql@14
     
     # Redémarrer le service
     brew services start postgresql@14
     ```
   - Messages d'erreur courants :
     - `ECONNREFUSED 127.0.0.1:5432` : PostgreSQL n'est pas démarré
     - `database "inmemory" does not exist` : La base de données n'a pas été créée
     - `password authentication failed` : Le mot de passe PostgreSQL est incorrect

### 2.3 Installation de Strapi

1. **Installation locale (recommandée)** :
   ```bash
   # Dans le dossier inmemory-backend
   npm install @strapi/strapi --save-dev
   npx strapi develop
   ```

2. **Dépannage** :
   - Si vous rencontrez des erreurs avec sqlite3 :
     - Vérifiez la version de Node.js (v18 LTS recommandée)
     - Ou utilisez l'installation locale comme indiqué ci-dessus
   - Si l'installation est interrompue :
     ```bash
     # Nettoyer l'installation
     rm -rf node_modules package-lock.json
     
     # Réinstaller
     npm install
     ```

3. **Configuration initiale de Strapi** :
   - À la première connexion, vous devrez créer un compte administrateur
   - Ce compte vous donnera accès à toutes les fonctionnalités de l'interface d'administration
   - Conservez bien les identifiants, ils seront nécessaires pour toutes les opérations d'administration

4. **Prochaines étapes après l'installation** :
   - Création des collections de contenu
   - Configuration des permissions
   - Test des API endpoints
   - Configuration des environnements (développement, production)

### 1.2 Structure des Collections Strapi

1. **Collections à créer** :
   - **Utilisateurs** (déjà géré par Strapi)
   - **Mémoires** :
     - Titre (string)
     - Contenu (richtext)
     - Date (datetime)
     - Statut (enum: draft, published)
     - Auteur (relation avec Users)
   - **Catégories** :
     - Nom (string)
     - Description (text)
     - Mémoires (relation avec Mémoires)

2. **Configuration des permissions** :
   - Public :
     - Lecture des mémoires publiées
     - Lecture des catégories
   - Authentifié :
     - Création/modification de ses propres mémoires
     - Lecture de toutes les mémoires
   - Administrateur :
     - Toutes les permissions

3. **API Endpoints** :
   - `/api/memories` : Gestion des mémoires
   - `/api/categories` : Gestion des catégories
   - `/api/users` : Gestion des utilisateurs

## 3. Déploiement

## 4. Sécurité

## 5. Maintenance et Monitoring

## 6. Évolution Future