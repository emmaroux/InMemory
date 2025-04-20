const fs = require('fs');
const path = require('path');

async function createCollections() {
  try {
    // Chemin vers le dossier des collections
    const collectionsPath = path.join(__dirname, '../src/api');
    
    // Création des dossiers pour memories
    const memoriesPath = path.join(collectionsPath, 'memory');
    const memoriesContentTypesPath = path.join(memoriesPath, 'content-types', 'memory');
    fs.mkdirSync(memoriesContentTypesPath, { recursive: true });
    
    // Création du fichier de configuration pour memories
    const memoriesConfig = {
      kind: 'collectionType',
      collectionName: 'memories',
      info: {
        singularName: 'memory',
        pluralName: 'memories',
        displayName: 'Mémoires',
        description: 'Collection des mémoires'
      },
      options: {},
      pluginOptions: {
        'content-manager': {
          visible: true
        },
        'content-type-builder': {
          visible: true
        }
      },
      attributes: {
        title: {
          type: 'string',
          required: true
        },
        content: {
          type: 'richtext',
          required: true
        },
        date: {
          type: 'datetime',
          required: true
        },
        status: {
          type: 'enumeration',
          enum: ['draft', 'published'],
          default: 'draft'
        },
        author: {
          type: 'relation',
          relation: 'manyToOne',
          target: 'plugin::users-permissions.user'
        },
        category: {
          type: 'relation',
          relation: 'manyToOne',
          target: 'api::category.category'
        },
        votes: {
          type: 'relation',
          relation: 'oneToMany',
          target: 'api::vote.vote'
        },
        comments: {
          type: 'relation',
          relation: 'oneToMany',
          target: 'api::comment.comment'
        }
      }
    };
    
    fs.writeFileSync(
      path.join(memoriesContentTypesPath, 'schema.json'),
      JSON.stringify(memoriesConfig, null, 2)
    );

    // Création des dossiers pour categories
    const categoriesPath = path.join(collectionsPath, 'category');
    const categoriesContentTypesPath = path.join(categoriesPath, 'content-types', 'category');
    fs.mkdirSync(categoriesContentTypesPath, { recursive: true });
    
    // Création du fichier de configuration pour categories
    const categoriesConfig = {
      kind: 'collectionType',
      collectionName: 'categories',
      info: {
        singularName: 'category',
        pluralName: 'categories',
        displayName: 'Catégories',
        description: 'Collection des catégories'
      },
      options: {},
      pluginOptions: {
        'content-manager': {
          visible: true
        },
        'content-type-builder': {
          visible: true
        }
      },
      attributes: {
        name: {
          type: 'string',
          required: true
        },
        description: {
          type: 'text'
        },
        memories: {
          type: 'relation',
          relation: 'oneToMany',
          target: 'api::memory.memory'
        }
      }
    };
    
    fs.writeFileSync(
      path.join(categoriesContentTypesPath, 'schema.json'),
      JSON.stringify(categoriesConfig, null, 2)
    );

    // Création des dossiers pour votes
    const votesPath = path.join(collectionsPath, 'vote');
    const votesContentTypesPath = path.join(votesPath, 'content-types', 'vote');
    fs.mkdirSync(votesContentTypesPath, { recursive: true });
    
    // Création du fichier de configuration pour votes
    const votesConfig = {
      kind: 'collectionType',
      collectionName: 'votes',
      info: {
        singularName: 'vote',
        pluralName: 'votes',
        displayName: 'Votes',
        description: 'Collection des votes'
      },
      options: {},
      pluginOptions: {
        'content-manager': {
          visible: true
        },
        'content-type-builder': {
          visible: true
        }
      },
      attributes: {
        value: {
          type: 'integer',
          required: true,
          min: 1,
          max: 5
        },
        user: {
          type: 'relation',
          relation: 'manyToOne',
          target: 'plugin::users-permissions.user'
        },
        memory: {
          type: 'relation',
          relation: 'manyToOne',
          target: 'api::memory.memory'
        }
      }
    };
    
    fs.writeFileSync(
      path.join(votesContentTypesPath, 'schema.json'),
      JSON.stringify(votesConfig, null, 2)
    );

    // Création des dossiers pour commentaires
    const commentsPath = path.join(collectionsPath, 'comment');
    const commentsContentTypesPath = path.join(commentsPath, 'content-types', 'comment');
    fs.mkdirSync(commentsContentTypesPath, { recursive: true });
    
    // Création du fichier de configuration pour commentaires
    const commentsConfig = {
      kind: 'collectionType',
      collectionName: 'comments',
      info: {
        singularName: 'comment',
        pluralName: 'comments',
        displayName: 'Commentaires',
        description: 'Collection des commentaires'
      },
      options: {},
      pluginOptions: {
        'content-manager': {
          visible: true
        },
        'content-type-builder': {
          visible: true
        }
      },
      attributes: {
        content: {
          type: 'text',
          required: true
        },
        date: {
          type: 'datetime',
          required: true
        },
        user: {
          type: 'relation',
          relation: 'manyToOne',
          target: 'plugin::users-permissions.user'
        },
        memory: {
          type: 'relation',
          relation: 'manyToOne',
          target: 'api::memory.memory'
        }
      }
    };
    
    fs.writeFileSync(
      path.join(commentsContentTypesPath, 'schema.json'),
      JSON.stringify(commentsConfig, null, 2)
    );

    console.log('Collections créées avec succès !');
    console.log('Redémarrez Strapi pour que les changements soient pris en compte.');
  } catch (error) {
    console.error('Erreur lors de la création des collections:', error);
  }
}

createCollections(); 