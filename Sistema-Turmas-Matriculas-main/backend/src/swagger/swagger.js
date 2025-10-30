import swaggerJsdoc from 'swagger-jsdoc';
import { appConfig } from '../config/database.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Sistema de Turmas e Matrículas',
    version: '1.0.0',
    description: 'API para gerenciamento de cursos, turmas, estudantes e matrículas.'
  },
  servers: [
    {
      url: `http://localhost:${appConfig.port}`,
      description: 'Ambiente local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
