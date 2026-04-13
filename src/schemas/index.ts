import type { FastifySchema } from 'fastify';
import { Type } from '@fastify/type-provider-typebox';

const errorResponseSchema = Type.Object({
  message: Type.String(),
  errors: Type.Optional(Type.Array(Type.Any())),
});

const userResponseSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  id: Type.Number(),
  isActivate: Type.Boolean({ default: false }),
  role: Type.String(),
  accessToken: Type.String(),
});

export const registerSchema = {
  tags: ['Авторизация'],
  summary: 'Авторизация пользователя',
  body: Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8 }),
    redirectUrl: Type.String({ format: 'uri' }),
  }),
  response: {
    201: userResponseSchema,
    400: errorResponseSchema,
    503: errorResponseSchema,
  },
};

export const loginSchema: FastifySchema = {
  tags: ['Авторизация'],
  summary: 'Авторизация пользователя',
  body: Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8 }),
  }),

  response: {
    200: userResponseSchema,
    400: errorResponseSchema,
  },
};

export const activateSchema = {
  tags: ['Авторизация'],
  summary: 'Активация аккаунта',
  params: Type.Object({
    uuid: Type.String({
      format: 'uuid',
    }),
  }),
  querystring: Type.Object({
    redirectUrl: Type.Optional(
      Type.String({
        format: 'uri',
      }),
    ),
  }),
  response: {
    200: {
      content: {
        'text/html': {
          schema: Type.String(),
        },
      },
    },
    302: {
      description: 'Редирект на указанный URL',
      headers: Type.Object({
        location: Type.String({ description: 'URL для редиректа' }),
      }),
      content: {
        'text/html': {
          schema: Type.String({ description: 'HTML страница редиректа' }),
        },
      },
    },
    400: errorResponseSchema,
  },
};

export const forgotPasswordSchema = {
  tags: ['Восстановление пароля'],
  summary: 'Отправка письма для сброса пароля',
  body: Type.Object({
    email: Type.String({
      format: 'email',
    }),
    redirectUrl: Type.String({
      format: 'uri',
    }),
  }),
  response: {
    200: Type.Null(),
    401: errorResponseSchema,
    503: errorResponseSchema,
  },
};

export const resetPasswordSchema = {
  tags: ['Восстановление пароля'],
  summary: 'Сброс пароля',
  body: Type.Object({
    uuid: Type.String({ format: 'uuid' }),
    password: Type.String({ minLength: 8 }),
  }),
  response: {
    200: Type.Null(),
    400: errorResponseSchema,
  },
};

export const refreshSchema = {
  tags: ['Авторизация'],
  summary: 'Обновление токена',
  response: {
    200: userResponseSchema,
    401: errorResponseSchema,
  },
};

export const currentUserSchema = {
  tags: ['Пользователь'],
  summary: 'Текущий пользователь',
  response: {
    200: userResponseSchema,
    401: errorResponseSchema,
  },
};
