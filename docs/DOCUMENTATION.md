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
  - [2.4 Création des Collections](#24-création-des-collections)
- [3. Stratégie de Déploiement](#3-stratégie-de-déploiement)
  - [3.1 Environnements](#31-environnements)
  - [3.2 Recommandations](#32-recommandations)
  - [3.3 Migration des Données](#33-migration-des-données)
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

1. **Options de Base de Données** :
   - **PostgreSQL Local** :
     - Installation via Homebrew
     - Idéal pour le développement
     - Configuration manuelle
   
   - **Neon (PostgreSQL Serverless)** :
     - Base de données gérée
     - Évolutivité automatique
     - Sauvegardes automatiques
     - Interface de gestion intuitive
   
   - **Autres Options** :
     - **Supabase** : PostgreSQL + services additionnels (auth, storage)
     - **Railway** : PostgreSQL + déploiement facile
     - **DigitalOcean** : PostgreSQL géré
     - **AWS RDS** : PostgreSQL sur AWS

2. **Portabilité** :
   - La structure de la base de données reste identique
   - Seuls les paramètres de connexion changent
   - Migration facile entre les environnements
   - Compatibilité totale des requêtes SQL

3. **Recommandation** :
   - Développement : PostgreSQL local
   - Préproduction/Production : Neon ou Supabase
     - Avantages :
       - Pas de gestion d'infrastructure
       - Évolutivité automatique
       - Sauvegardes gérées
       - Interface de gestion
       - Support technique

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

### 2.4 Création des Collections

1. **Script de création** :
   - Le script `create-schemas.js` dans le dossier `scripts` permet de générer automatiquement les fichiers de schéma pour toutes les collections
   - Il crée les dossiers nécessaires dans `src/api/[collection]/content-types/[collection]/schema.json`
   - Les collections créées sont :
     - Mémoires (Memory)
     - Catégories (Category)
     - Votes (Vote)
     - Commentaires (Comment)

2. **Exécution du script** :
   ```bash
   cd inmemory-backend
   node scripts/create-schemas.js
   ```

3. **Redémarrage de Strapi** :
   - Après l'exécution du script, redémarrer Strapi pour que les changements soient pris en compte :
   ```bash
   npm run develop
   ```

4. **Vérification** :
   - Vérifier dans l'interface d'administration que toutes les collections sont présentes
   - Vérifier que les relations entre les collections sont correctement configurées
   - Tester la création d'éléments dans chaque collection

### 1.2 Structure des Collections Strapi

1. **Collections principales** :
   - **Mémoires (Memory)**
     - Titre (string, requis)
     - Contenu (richtext, requis)
     - Date (datetime, requis)
     - Statut (enum: draft/published)
     - Auteur (relation manyToOne avec User)
     - Catégorie (relation manyToOne avec Category)
     - Votes (relation oneToMany avec Vote)
     - Commentaires (relation oneToMany avec Comment)

   - **Catégories (Category)**
     - Nom (string, requis)
     - Description (text)
     - Mémoires (relation oneToMany avec Memory)

   - **Votes (Vote)**
     - Valeur (integer, requis, min: 1, max: 5)
     - Utilisateur (relation manyToOne avec User)
     - Mémoire (relation manyToOne avec Memory)

   - **Commentaires (Comment)**
     - Contenu (text, requis)
     - Date (datetime, requis)
     - Utilisateur (relation manyToOne avec User)
     - Mémoire (relation manyToOne avec Memory)

2. **Relations entre les collections** :
   - Une mémoire appartient à une catégorie (manyToOne)
   - Une mémoire peut avoir plusieurs votes (oneToMany)
   - Une mémoire peut avoir plusieurs commentaires (oneToMany)
   - Un vote appartient à un utilisateur et une mémoire (manyToOne)
   - Un commentaire appartient à un utilisateur et une mémoire (manyToOne)

3. **Configuration des permissions** :
   - Public :
     - Lecture des mémoires publiées
     - Lecture des catégories
     - Lecture des votes et commentaires
   - Authentifié :
     - Création/modification de ses propres mémoires
     - Création de votes et commentaires
     - Lecture de toutes les mémoires
   - Administrateur :
     - Toutes les permissions

4. **API Endpoints** :
   - `/api/memories` : Gestion des mémoires
   - `/api/categories` : Gestion des catégories
   - `/api/votes` : Gestion des votes
   - `/api/comments` : Gestion des commentaires
   - `/api/users` : Gestion des utilisateurs

## 3. Stratégie de Déploiement

### 3.1 Environnements

1. **Développement Local** :
   - Utilisation de PostgreSQL en local
   - Avantages :
     - Développement rapide
     - Pas de coût
     - Pas de dépendance à Internet
   - Inconvénients :
     - Configuration différente de la production
     - Risque de divergence avec l'environnement de production

2. **Environnement de Préproduction** :
   - Hébergement sur un service cloud (ex: Heroku, DigitalOcean)
   - Base de données PostgreSQL gérée
   - Avantages :
     - Configuration proche de la production
     - Tests en conditions réelles
     - Possibilité de déploiement continu

3. **Environnement de Production** :
   - Hébergement sur un service cloud
   - Base de données PostgreSQL gérée avec sauvegardes
   - Avantages :
     - Haute disponibilité
     - Sécurité renforcée
     - Monitoring

### 3.2 Recommandations

1. **Pour le développement initial** :
   - Commencer en local pour :
     - Définir la structure des collections
     - Configurer les permissions
     - Développer les API endpoints
     - Tester les fonctionnalités de base

2. **Pour la préproduction** :
   - Mettre en place dès que :
     - La structure de base est stable
     - Les premières fonctionnalités sont testées
     - L'équipe est prête à tester en conditions réelles

3. **Pour la production** :
   - Déployer quand :
     - Les tests sont validés en préproduction
     - La sécurité est vérifiée
     - Le monitoring est en place

### 3.3 Migration des Données

1. **De local vers préproduction** :
   - Exporter les collections via l'API Strapi
   - Importer dans l'environnement de préproduction
   - Vérifier les relations et les permissions

2. **De préproduction vers production** :
   - Utiliser les mêmes scripts de migration
   - Effectuer une sauvegarde complète
   - Tester la restauration

## 4. Sécurité

## 5. Maintenance et Monitoring

## 6. Évolution Future