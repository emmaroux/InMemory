module.exports = {
  collections: {
    partage: {
      kind: 'collectionType',
      collectionName: 'partages',
      attributes: {
        title: {
          type: 'string',
          required: true
        },
        url: {
          type: 'string',
          required: true
        },
        image: {
          type: 'string'
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
        team: {
          type: 'relation',
          relation: 'manyToOne',
          target: 'api::team.team'
        },
        votes: {
          type: 'relation',
          relation: 'oneToMany',
          target: 'api::vote.vote'
        }
      }
    },
    team: {
      kind: 'collectionType',
      collectionName: 'teams',
      attributes: {
        name: {
          type: 'string',
          required: true
        },
        description: {
          type: 'text'
        },
        partages: {
          type: 'relation',
          relation: 'oneToMany',
          target: 'api::partage.partage'
        }
      }
    },
    vote: {
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
        partage: {
          type: 'relation',
          relation: 'manyToOne',
          target: 'api::partage.partage'
        },
        team: {
          type: 'relation',
          relation: 'manyToOne',
          target: 'api::team.team'
        }
      }
    }
  }
}; 