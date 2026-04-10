const swaggerJSDoc = require('swagger-jsdoc');

const specs = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ArbreGen API',
      version: '1.0.0',
      description: "API Express.js pour gerer les arbres genealogiques multi-utilisateurs stockes dans MongoDB."
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur local'
      }
    ],
    components: {
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['username'],
          properties: {
            username: {
              type: 'string',
              example: 'Aina'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '66152e3ca9b9f1ce4a59d8aa'
            },
            username: {
              type: 'string',
              example: 'Aina'
            },
            tree: {
              $ref: '#/components/schemas/Tree'
            }
          }
        },
        Tree: {
          type: 'object',
          properties: {
            fams: {
              type: 'object',
              additionalProperties: true
            },
            ppl: {
              type: 'object',
              additionalProperties: true
            },
            nid: {
              type: 'number',
              example: 8
            },
            cc: {
              type: 'number',
              example: 2
            },
            rootId: {
              type: 'string',
              example: 'n2'
            }
          }
        },
        NamePayload: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Rakoto'
            }
          }
        },
        ReplaceTreeRequest: {
          type: 'object',
          required: ['tree'],
          properties: {
            tree: {
              $ref: '#/components/schemas/Tree'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/docs/*.js']
});

module.exports = { specs };
