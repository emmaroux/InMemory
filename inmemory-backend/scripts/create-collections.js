const { strapi } = require('@strapi/strapi');

async function createCollections() {
  try {
    // Création de la collection Mémoires
    await strapi.contentTypes.create({
      kind: 'collectionType',
      collectionName: 'memories',
      displayName: 'Mémoires',
      singularName: 'memory',
      pluralName: 'memories',
      description: 'Collection des mémoires',
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
        }
      }
    });

    // Création de la collection Catégories
    await strapi.contentTypes.create({
      kind: 'collectionType',
      collectionName: 'categories',
      displayName: 'Catégories',
      singularName: 'category',
      pluralName: 'categories',
      description: 'Collection des catégories',
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
    });

    console.log('Collections créées avec succès !');
  } catch (error) {
    console.error('Erreur lors de la création des collections:', error);
  }
}

module.exports = createCollections; 