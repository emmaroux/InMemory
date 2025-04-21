# InMemory Backend

## Documentation Technique

### Contexte du Projet

InMemory est une plateforme collaborative permettant aux équipes de partager et d'organiser des ressources (articles, tutoriels, outils, etc.). Chaque équipe peut voter pour les ressources qu'elle trouve utiles et laisser des commentaires. L'objectif est de créer une base de connaissances partagée et organisée par les équipes.

### Architecture Technique

- Frontend : Next.js 14 avec TypeScript
- Backend : Strapi
- Base de données : PostgreSQL (recommandé)

## Structure du Projet

```
.
├── config/                 # Configuration de Strapi
│   ├── database.js        # Configuration de la base de données
│   ├── middlewares.js     # Configuration des middlewares
│   └── plugins.js         # Configuration des plugins
├── src/                   # Code source
│   ├── api/              # Types de contenu
│   │   ├── resource/     # Ressources
│   │   ├── team/         # Équipes
│   │   ├── comment/      # Commentaires
│   │   ├── vote/         # Votes
│   │   └── category/     # Catégories
│   └── extensions/       # Extensions
│       └── users-permissions/  # Extension users-permissions
├── scripts/              # Scripts utilitaires
├── database/            # Migrations de la base de données
├── public/              # Fichiers publics
├── .env                 # Variables d'environnement
├── .env.example         # Exemple de variables d'environnement
├── package.json         # Dépendances
└── README.md           # Documentation
```

## Configuration Strapi

### 1. Installation et Configuration Initiale

```bash
npx create-strapi-app@latest inmemory-backend --quickstart
```

### 2. Configuration de la Base de Données

```javascript
// config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'inmemory'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', 'postgres'),
      schema: env('DATABASE_SCHEMA', 'public'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
    },
  },
});
```

### 3. Configuration des Middlewares

```javascript
// config/middlewares.js
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### 4. Configuration des Plugins

```javascript
// config/plugins.js
module.exports = {
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
};
```

## Types de Contenu

### 1. Team (Équipe)
- **Nom** : `team`
- **Champs** :
  - `name` (Text) : Nom de l'équipe
  - `color` (Text) : Code couleur hexadécimal
  - `users` (Relation many-to-many avec User)
  - `comments` (Relation one-to-many avec Comment)
  - `votes` (Relation one-to-many avec Vote)

### 2. Resource (Ressource)
- **Nom** : `resource`
- **Champs** :
  - `title` (Text) : Titre de la ressource
  - `description` (Rich Text) : Description détaillée
  - `imageUrl` (Text) : URL de l'image
  - `link` (Text) : URL de la ressource
  - `category` (Relation many-to-one avec Category)
  - `votes` (Relation one-to-many avec Vote)
  - `comments` (Relation one-to-many avec Comment)

### 3. Vote
- **Nom** : `vote`
- **Champs** :
  - `value` (Integer) : Valeur du vote (1 par défaut)
  - `resource` (Relation many-to-one avec Resource)
  - `team` (Relation many-to-one avec Team)
  - `user` (Relation many-to-one avec User)

### 4. Comment
- **Nom** : `comment`
- **Champs** :
  - `content` (Text) : Contenu du commentaire
  - `resource` (Relation many-to-one avec Resource)
  - `team` (Relation many-to-one avec Team)
  - `user` (Relation many-to-one avec User)

### 5. Category
- **Nom** : `category`
- **Champs** :
  - `name` (Text) : Nom de la catégorie
  - `resources` (Relation one-to-many avec Resource)

## API Endpoints

### 1. Équipes
```
GET /api/teams
```
- Retourne toutes les équipes
- Inclure les utilisateurs associés

### 2. Ressources
```
GET /api/resources
```
Paramètres :
- `populate=*` : Inclure toutes les relations
- `pagination[page]` : Numéro de la page
- `pagination[pageSize]` : Nombre d'éléments par page
- `filters[category][id][$eq]` : Filtrer par catégorie

### 3. Votes
```
GET /api/votes
```
Paramètres :
- `filters[resource][id][$eq]` : Filtrer par ressource
- `filters[team][id][$eq]` : Filtrer par équipe
- `populate=team` : Inclure les données de l'équipe

### 4. Commentaires
```
GET /api/comments
```
Paramètres :
- `filters[resource][id][$eq]` : Filtrer par ressource
- `filters[team][id][$eq]` : Filtrer par équipe
- `sort[0]=createdAt:desc` : Trier par date
- `populate=team` : Inclure les données de l'équipe

## Sécurité et Permissions

### 1. Configuration des Permissions
- Dans le panneau d'administration Strapi
- Section "Settings" > "Users & Permissions Plugin" > "Roles"
- Configurer les permissions pour chaque type de contenu

### 2. Rôles Recommandés
- Authenticated : Peut voter et commenter
- Public : Peut voir les ressources
- Admin : Accès complet

### 3. Politiques de Sécurité
- Limiter la taille des uploads
- Valider les URLs des images
- Sanitizer les commentaires
- Limiter le nombre de votes par utilisateur/équipe

## Performance et Optimisation

### 1. Mise en Cache
- Configurer le cache pour les requêtes fréquentes
- Mettre en cache les listes de ressources
- Invalider le cache lors des modifications

### 2. Optimisation des Requêtes
- Utiliser la pagination
- Limiter les champs retournés
- Optimiser les relations

### 3. Monitoring
- Configurer les logs
- Surveiller les performances
- Mettre en place des alertes

## Tests et Validation

### 1. Tests d'API
- Tester tous les endpoints
- Vérifier les permissions
- Tester les cas d'erreur

### 2. Validation des Données
- Vérifier les formats des URLs
- Valider les couleurs hexadécimales
- Limiter la taille des commentaires

## Déploiement

### 1. Configuration de Production
- Utiliser des variables d'environnement
- Configurer SSL
- Mettre en place un backup automatique

### 2. Monitoring
- Configurer des alertes
- Surveiller les performances
- Tracer les erreurs

## Documentation Additionnelle

- [Documentation Strapi](https://docs.strapi.io/)
- [Guide de Déploiement](https://docs.strapi.io/dev-docs/deployment)
- [API Reference](https://docs.strapi.io/dev-docs/api/rest)

## Contact

Pour toute question ou clarification, n'hésitez pas à contacter l'équipe frontend.

## FAQ Frontend

### 1. Structure des Relations

Les relations dans Strapi sont bidirectionnelles et sont automatiquement gérées par le système. Par exemple :
- Quand une équipe (`team`) crée un commentaire (`comment`), la relation est automatiquement établie dans les deux sens
- Quand une ressource (`resource`) reçoit un vote (`vote`), la relation est automatiquement mise à jour

Cependant, il est important de noter que :
- Les relations doivent être correctement définies dans les schémas des deux types de contenu concernés
- Les permissions doivent être configurées pour permettre ces opérations

### 2. Gestion des Votes

#### Prévention des Votes Multiples
```javascript
// Exemple de logique dans le service de vote
async createVote(data) {
  const existingVote = await strapi.db.query('api::vote.vote').findOne({
    where: {
      resource: data.resource,
      team: data.team,
      user: data.user
    }
  });

  if (existingVote) {
    throw new Error('Un vote existe déjà pour cette ressource dans cette équipe');
  }

  return await strapi.entityService.create('api::vote.vote', { data });
}
```

#### Comptage des Votes
- Le comptage des votes est géré côté backend via des requêtes agrégées
- Exemple de requête pour obtenir le nombre de votes :
```javascript
const voteCount = await strapi.db.query('api::vote.vote').count({
  where: {
    resource: resourceId,
    team: teamId
  }
});
```

### 3. Format des Réponses API

#### Format Standard des Listes
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Titre de la ressource",
        "description": "Description...",
        "createdAt": "2024-03-20T10:00:00.000Z",
        "updatedAt": "2024-03-20T10:00:00.000Z",
        "category": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Catégorie"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 50
    }
  }
}
```

### 4. Gestion des Images

#### Qu'est-ce que Cloudinary ?

Cloudinary est un service de gestion d'images et de vidéos dans le cloud qui offre :

1. **Stockage et Distribution**
   - Stockage sécurisé des médias
   - Distribution via CDN mondial
   - Sauvegarde automatique

2. **Optimisation Automatique**
   - Compression intelligente
   - Conversion automatique en WebP
   - Redimensionnement à la volée
   - Détection automatique de la qualité d'image

3. **Transformations d'Images**
   - Redimensionnement
   - Recadrage
   - Filtres et effets
   - Watermarking
   - Optimisation pour mobile

4. **Avantages Clés**
   - Gratuit jusqu'à 25GB/mois
   - API simple et bien documentée
   - Intégration facile avec Strapi
   - Excellente performance
   - Sécurité renforcée

#### Comparaison avec d'autres Solutions

1. **Cloudinary vs Stockage Local**
   - Cloudinary : CDN, optimisation, scalable
   - Local : Simple, limité, non-scalable

2. **Cloudinary vs AWS S3**
   - Cloudinary : Plus simple, optimisations intégrées
   - S3 : Plus technique, nécessite configuration supplémentaire

3. **Cloudinary vs Google Cloud Storage**
   - Cloudinary : Interface utilisateur, transformations
   - Google : Plus technique, moins d'outils intégrés

#### Comment ça marche ?

1. **Upload d'Image**
```javascript
// L'image est envoyée à Cloudinary via Strapi
const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

// Cloudinary retourne une URL optimisée
const imageUrl = "https://res.cloudinary.com/votre-compte/image/upload/v1234567890/photo.jpg";
```

2. **Utilisation avec Transformations**
```javascript
// Image originale
<img src={imageUrl} />

// Image redimensionnée
<img src={`${imageUrl}?w=300&h=200`} />

// Image optimisée pour mobile
<img src={`${imageUrl}?f=auto&q=auto`} />

// Image avec filtre
<img src={`${imageUrl}?e=grayscale`} />
```

3. **Exemples de Transformations Courantes**
```javascript
// Redimensionnement intelligent
`${imageUrl}?w=300&h=200&c=fill`

// Optimisation pour le web
`${imageUrl}?f=auto&q=auto`

// Format WebP avec fallback
`${imageUrl}?f=auto`

// Recadrage intelligent
`${imageUrl}?w=300&h=200&c=thumb`
```

#### Tarification

1. **Plan Gratuit**
   - 25GB de stockage
   - 25GB de bande passante
   - Transformations illimitées
   - CDN mondial

2. **Plans Payants**
   - Plus de stockage
   - Plus de bande passante
   - Fonctionnalités avancées
   - Support prioritaire

#### Configuration Recommandée

1. **Variables d'Environnement**
```env
CLOUDINARY_NAME=votre-nom
CLOUDINARY_KEY=votre-cle-api
CLOUDINARY_SECRET=votre-secret-api
```

2. **Configuration Strapi**
```javascript
// config/plugins.js
module.exports = {
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
};
```

### 5. Authentification

#### Format du Token JWT
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@example.com",
    "provider": "local",
    "confirmed": true,
    "blocked": false,
    "role": {
      "id": 1,
      "name": "Authenticated",
      "description": "Default role given to authenticated user.",
      "type": "authenticated"
    }
  }
}
```

#### Rafraîchissement du Token
- Strapi ne fournit pas d'endpoint dédié pour le rafraîchissement du token
- Le token expire après 7 jours (configurable dans `config/plugins.js`)
- Recommandation : implémenter une logique côté frontend pour :
  1. Détecter l'expiration du token
  2. Rediriger vers la page de login
  3. Stocker le token dans un cookie sécurisé

### 6. Exemples de Requêtes

#### Création d'une Ressource
```javascript
fetch('/api/resources', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    data: {
      title: "Nouvelle ressource",
      description: "Description...",
      imageUrl: "https://example.com/image.jpg",
      link: "https://example.com",
      category: 1
    }
  })
});
```

#### Récupération des Ressources avec Filtres
```javascript
fetch('/api/resources?populate=*&filters[category][id][$eq]=1&pagination[page]=1&pagination[pageSize]=10', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
```

## Dépannage

### Problèmes d'Authentification

#### 1. Vérification de l'Utilisateur

1. **Vérifier l'existence de l'utilisateur**
```bash
# Se connecter à la base de données
psql -U postgres -d inmemory

# Vérifier les utilisateurs
SELECT * FROM users WHERE email = 'emmanuelle@fabriquerdemain.io';
```

2. **Vérifier les permissions**
```bash
# Vérifier les rôles
SELECT * FROM users_permissions_role;

# Vérifier les permissions de l'utilisateur
SELECT * FROM users_permissions_user WHERE email = 'emmanuelle@fabriquerdemain.io';
```

#### 2. Configuration de l'Authentification

1. **Vérifier la configuration JWT**
```javascript
// config/plugins.js
module.exports = {
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      jwtSecret: env('JWT_SECRET'),
    },
  },
};
```

2. **Vérifier les variables d'environnement**
```env
JWT_SECRET=votre-secret-jwt
ADMIN_JWT_SECRET=votre-secret-admin
```

#### 3. Endpoints d'Authentification

1. **Authentification Utilisateur**
```bash
# Endpoint
POST /api/auth/local

# Corps de la requête
{
  "identifier": "emmanuelle@fabriquerdemain.io",
  "password": "votre-mot-de-passe"
}

# Réponse attendue
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "emmanuelle",
    "email": "emmanuelle@fabriquerdemain.io",
    "provider": "local",
    "confirmed": true,
    "blocked": false,
    "role": {
      "id": 1,
      "name": "Authenticated",
      "description": "Default role given to authenticated user.",
      "type": "authenticated"
    }
  }
}
```

2. **Authentification Admin**
```bash
# Endpoint
POST /admin/login

# Corps de la requête
{
  "email": "emmanuelle@fabriquerdemain.io",
  "password": "votre-mot-de-passe"
}
```

#### 4. Résolution des Problèmes Courants

1. **Erreur "Invalid identifier or password"**
- Vérifier que l'utilisateur existe
- Vérifier que le mot de passe est correct
- Vérifier que l'utilisateur n'est pas bloqué
- Vérifier que l'email est confirmé (sauf pour les comptes admin)

> **Note sur la confirmation d'email** :
> - Les comptes admin n'ont pas besoin de confirmation d'email
> - La confirmation d'email est requise uniquement pour les utilisateurs normaux
> - Pour désactiver la confirmation d'email pour tous les utilisateurs, modifier dans l'interface admin :
>   - Settings > Users & Permissions Plugin > Advanced Settings
>   - Décocher "Enable email confirmation"

2. **Erreur "User not found"**
- Créer l'utilisateur via l'interface admin
- Vérifier l'orthographe de l'email
- Vérifier que l'utilisateur n'a pas été supprimé

3. **Erreur "JWT expired"**
- Le token a expiré
- Se reconnecter pour obtenir un nouveau token
- Vérifier la configuration JWT dans `config/plugins.js`

#### 5. Bonnes Pratiques

1. **Sécurité**
- Utiliser des mots de passe forts
- Activer la confirmation par email
- Limiter les tentatives de connexion
- Utiliser HTTPS en production

2. **Gestion des Tokens**
- Stocker le token dans un cookie sécurisé
- Ne pas exposer le token dans les logs
- Implémenter un mécanisme de rafraîchissement
- Gérer l'expiration du token côté frontend

3. **Permissions**
- Configurer les rôles et permissions dans l'interface admin
- Tester les permissions avec différents rôles
- Documenter les permissions requises pour chaque endpoint

#### 6. Scripts Utiles

1. **Créer un utilisateur admin**
```bash
# Via l'interface admin
http://localhost:1337/admin

# Ou via l'API
POST /admin/register-admin
{
  "email": "emmanuelle@fabriquerdemain.io",
  "password": "votre-mot-de-passe",
  "firstname": "Emmanuelle",
  "lastname": "Leroux"
}
```

2. **Réinitialiser un mot de passe**
```bash
# Via l'interface admin
http://localhost:1337/admin

# Ou via l'API
POST /admin/forgot-password
{
  "email": "emmanuelle@fabriquerdemain.io"
}
```

## Configuration des Permissions

### Rôles et Permissions Requises

#### 1. Rôle Public (Non authentifié)

**Permissions nécessaires** :
1. **Authentification**
   - `POST /api/auth/local` : Permettre la connexion
   - `POST /api/auth/local/register` : Permettre l'inscription
   - `GET /api/auth/me` : Permettre la vérification du token

2. **Ressources**
   - `GET /api/resources` : Lire les ressources
   - `GET /api/resources/:id` : Lire une ressource spécifique
   - `GET /api/categories` : Lire les catégories

3. **Équipes**
   - `GET /api/teams` : Lire les équipes
   - `GET /api/teams/:id` : Lire une équipe spécifique

#### 2. Rôle Authenticated (Utilisateur connecté)

**Permissions supplémentaires** :
1. **Votes**
   - `POST /api/votes` : Créer un vote
   - `GET /api/votes` : Lire ses votes
   - `DELETE /api/votes/:id` : Supprimer son vote

2. **Commentaires**
   - `POST /api/comments` : Créer un commentaire
   - `GET /api/comments` : Lire les commentaires
   - `PUT /api/comments/:id` : Modifier son commentaire
   - `DELETE /api/comments/:id` : Supprimer son commentaire

3. **Profil**
   - `PUT /api/users/:id` : Modifier son profil
   - `GET /api/users/me` : Lire son profil

#### 3. Rôle Admin

**Toutes les permissions** :
- Accès complet à tous les endpoints
- Gestion des utilisateurs
- Gestion des permissions
- Configuration du système

### Configuration dans l'Interface Admin

1. **Accéder aux permissions**
   - Settings > Users & Permissions Plugin > Roles
   - Cliquer sur le rôle à configurer

2. **Configurer le rôle Public**
   - Cocher les permissions nécessaires
   - Sauvegarder les modifications

3. **Vérifier les permissions**
   - Tester chaque endpoint
   - Vérifier les logs en cas d'erreur

### Exemple de Configuration

```javascript
// Permissions pour le rôle Public
{
  "auth": {
    "local": {
      "post": true,  // Permettre la connexion
      "register": true  // Permettre l'inscription
    }
  },
  "resource": {
    "find": true,  // Lire les ressources
    "findOne": true  // Lire une ressource
  },
  "team": {
    "find": true,  // Lire les équipes
    "findOne": true  // Lire une équipe
  }
}
```

### Bonnes Pratiques

1. **Sécurité**
   - Ne donner que les permissions nécessaires
   - Vérifier régulièrement les permissions
   - Documenter les changements de permissions

2. **Tests**
   - Tester chaque rôle séparément
   - Vérifier les cas limites
   - Documenter les tests

3. **Maintenance**
   - Revoir les permissions régulièrement
   - Mettre à jour la documentation
   - Former les nouveaux développeurs

## Configuration du Seeding

### Processus de Seeding Automatique

Le seeding est configuré pour s'exécuter automatiquement au démarrage de Strapi. Voici comment cela fonctionne :

1. **Structure des Fichiers** :
   - `src/index.js` : Contient la logique de bootstrap qui déclenche le seeding
   - `scripts/seed.js` : Contient la logique de création des données initiales

2. **Données de Test** :
   - Un utilisateur test est créé avec les identifiants :
     - Email : test@example.com
     - Mot de passe : password123
   - Une catégorie test est créée
   - Une ressource test est créée

3. **Logs** :
   - Les logs du processus de seeding sont affichés dans la console
   - Les logs sont formatés pour être facilement visibles avec des séparateurs

### Comment Forcer le Seeding

Si vous souhaitez forcer le seeding à un moment donné :

1. Arrêtez Strapi (Ctrl+C)
2. Redémarrez Strapi :
   ```bash
   npm run develop
   ```

### Vérification du Seeding

Pour vérifier que le seeding a fonctionné :

1. Connectez-vous à l'interface d'administration de Strapi
2. Vérifiez la présence des données dans les sections :
   - Users & Permissions
   - Categories
   - Resources

### Dépannage

Si le seeding ne fonctionne pas :

1. Vérifiez les logs dans la console
2. Assurez-vous que le fichier `src/index.js` est correctement configuré
3. Vérifiez que le fichier `scripts/seed.js` existe et est accessible
4. Vérifiez les permissions dans l'interface d'administration de Strapi
