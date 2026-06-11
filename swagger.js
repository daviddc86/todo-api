const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'API REST para gestión de tareas con autenticación JWT',
      contact: {
        name: 'API Support',
        email: 'support@todoapi.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        TaskInput: {
          type: 'object',
          required: ['title', 'responsible'],
          properties: {
            title: {
              type: 'string',
              example: 'Revisar PR del módulo de pagos',
            },
            description: {
              type: 'string',
              example: 'Revisar y aprobar el pull request antes del lunes',
            },
            responsible: {
              type: 'string',
              example: 'María López',
            },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            responsible: { type: 'string' },
            completed: { type: 'boolean' },
            user: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
