import { Controller } from "../controller";
import type { FastifyPluginCallback, FastifySchema } from "fastify";
import { authMiddleware } from "../middleware/auth-middleware";
import { Type } from "@fastify/type-provider-typebox";

export const REDIRECT_PARAM = "redirectUrl" as const;
export const UUID_PARAM = "uuid" as const;

const errorResponseSchema = Type.Object({
  message: Type.String(),
  errors: Type.Optional(Type.Array(Type.Any())),
});

const userResponseSchema = Type.Object({
  email: Type.String({ format: "email" }),
  id: Type.Number(),
  isActivate: Type.Boolean({ default: false }),
  role: Type.String(),
});

const registerSchema: FastifySchema = {
  tags: ["Авторизация"],
  summary: "Авторизация пользователя",
  body: Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 8 }),
    redirectUrl: Type.String({ format: "uri" }),
  }),

  response: {
    201: userResponseSchema,
    400: errorResponseSchema,
    503: errorResponseSchema,
  },
};

const loginSchema: FastifySchema = {
  tags: ["Авторизация"],
  summary: "Авторизация пользователя",
  body: Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 8 }),
  }),

  response: {
    200: userResponseSchema,
    400: errorResponseSchema,
  },
};

export const activateSchema = {
  tags: ["Авторизация"],
  summary: "Активация аккаунта",
  params: Type.Object({
    uuid: Type.String({
      format: "uuid",
    }),
  }),
  querystring: Type.Object({
    redirectUrl: Type.Optional(
      Type.String({
        format: "uri",
      }),
    ),
  }),
  response: {
    200: {
      content: {
        "text/html": {
          schema: Type.String(),
        },
      },
    },
    302: {
      description: "Редирект на указанный URL",
      headers: Type.Object({
        location: Type.String({ description: "URL для редиректа" }),
      }),
      content: {
        "text/html": {
          schema: Type.String({ description: "HTML страница редиректа" }),
        },
      },
    },
    400: errorResponseSchema,
  },
};

const forgotPasswordSchema = {
  tags: ["Восстановление пароля"],
  summary: "Отправка письма для сброса пароля",
  body: Type.Object({
    email: Type.String({
      format: "email",
    }),
    redirectUrl: Type.String({
      format: "uri",
    }),
  }),
  response: {
    200: Type.Null(),
    401: errorResponseSchema,
    503: errorResponseSchema,
  },
};

const resetPasswordSchema = {
  tags: ["Восстановление пароля"],
  summary: "Сброс пароля",
  body: Type.Object({
    uuid: Type.String({ format: "uuid" }),
    password: Type.String({ minLength: 8 }),
  }),
  response: {
    200: Type.Null(),
    400: errorResponseSchema,
  },
};

export const refreshSchema = {
  tags: ["Авторизация"],
  summary: "Обновление токена",
  response: {
    200: userResponseSchema,
    401: errorResponseSchema,
  },
};

export const currentUserSchema = {
  tags: ["Пользователь"],
  summary: "Текущий пользователь",
  response: {
    200: userResponseSchema,
    401: errorResponseSchema,
  },
};

export const routes: FastifyPluginCallback = (instance, _options, done) => {
  const controller = new Controller(instance);

  instance.post("/register", { schema: registerSchema }, controller.register);

  instance.get(
    `/activate/:${UUID_PARAM}`,
    { schema: activateSchema },
    controller.activate,
  );

  instance.post("/login", { schema: loginSchema }, controller.login);

  instance.post(
    "/forgotPassword",
    { schema: forgotPasswordSchema },
    controller.forgotPassword,
  );

  instance.post(
    "/resetPassword",
    { schema: resetPasswordSchema },
    controller.resetPassword,
  );

  instance.post("/refresh", { schema: refreshSchema }, controller.refresh);

  instance.get(
    "/currentUser",
    { preHandler: authMiddleware(controller), schema: currentUserSchema },
    controller.currentUser,
  );
  done();
};
