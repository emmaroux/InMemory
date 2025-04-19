module.exports = {
  collections: {
    memories: {
      kind: 'collectionType',
      collectionName: 'memories',
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
    },
    categories: {
      kind: 'collectionType',
      collectionName: 'categories',
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
    }
  }
}; 