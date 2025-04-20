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
    },
    votes: {
      kind: 'collectionType',
      collectionName: 'votes',
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
    comments: {
      kind: 'collectionType',
      collectionName: 'comments',
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
  }
}; 