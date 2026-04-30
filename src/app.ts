import dotenv from 'dotenv';
import { routes } from './routes';
import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import { sequelizeInit } from './plugins/db-plugin';
import cors from '@fastify/cors';
import { errorMiddleware } from './middleware/error-middleware';
import { transporterInit } from './plugins/mailer-plugin';
import { ApiError } from './exception/api-errors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

dotenv.config();
const NODE_ENV = process.env.NODE_ENV ?? 'development';

const PORT = process.env.PORT || 8001;
const app = Fastify({
  logger:
    NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
          level: 'debug',
        }
      : {
          level: 'info',
        },
  schemaErrorFormatter: (error) => {
    return ApiError.ValidationError(error.at(0)?.message);
  },
}).withTypeProvider<TypeBoxTypeProvider>();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8000'];
app.register(cors, {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
});
app.register(cookie);
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});
if (NODE_ENV === 'development') {
  app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Авторизация',
        description: 'swagger API',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server',
        },
      ],

      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Введите JWT токен для авторизации',
          },
        },
      },

      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  });
  app.register(swaggerUi, {
    routePrefix: '/swagger',
  });
}
app.register(transporterInit);
app.register(routes, { prefix: '/api/v1' });
app.setErrorHandler(errorMiddleware);

const start = async () => {
  await app.register(sequelizeInit);

  app.listen({ port: Number(PORT), host: '0.0.0.0' }, (error, address) => {
    if (error) {
      app.log.error(error);
      process.exit(1);
    }
    console.log(`server started on address ${address}`);
  });
};

start();
