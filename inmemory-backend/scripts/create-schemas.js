const fs = require('fs');
const path = require('path');

// Configuration des collections
const collections = {
  memory: {
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
  },
  category: {
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
  },
  vote: {
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
  },
  comment: {
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
  }
};

// Fonction pour créer les dossiers et fichiers nécessaires
function createCollectionFiles() {
  const basePath = path.join(__dirname, '..', 'src', 'api');
  
  Object.entries(collections).forEach(([name, config]) => {
    const collectionPath = path.join(basePath, name);
    const contentTypesPath = path.join(collectionPath, 'content-types', name);
    const schemaPath = path.join(contentTypesPath, 'schema.json');
    
    // Créer les dossiers nécessaires
    fs.mkdirSync(contentTypesPath, { recursive: true });
    
    // Écrire le fichier schema.json
    fs.writeFileSync(schemaPath, JSON.stringify(config, null, 2));
    
    console.log(`Collection ${name} créée avec succès`);
  });
}

// Exécuter la création des fichiers
createCollectionFiles(); 