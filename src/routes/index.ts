import { Router } from "express";
import { Controller } from "../controller";
import type { FastifyPluginCallback, FastifySchema } from "fastify";
import type { JSONSchema7 } from "json-schema";
import { authMiddleware } from "../middleware/auth-middleware";

export const router = Router();
export const REDIRECT_PARAM = "redirectUrl" as const;
export const UUID_PARAM = "uuid" as const;

type Schema = Partial<Record<keyof FastifySchema, JSONSchema7>>;

const registerSchema: Schema = {
  body: {
    title: "register",
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
      redirectUrl: { type: "string", format: "uri" },
    },
    required: ["email", "password", "redirectUrl"],
  },
};

export const routes: FastifyPluginCallback = (instance, _options, done) => {
  const controller = new Controller(instance);

  instance.post("/register", { schema: registerSchema }, controller.register);

  instance.get(`/activate/:${UUID_PARAM}`, controller.activate);

  instance.post("/login", controller.login);

  instance.post("/forgotPassword", controller.forgotPassword);

  instance.post("/resetPassword", controller.resetPassword);

  instance.post("/refresh", controller.refresh);

  instance.get(
    "/currentUser",
    { preHandler: authMiddleware(controller) },
    controller.currentUser,
  );
  done();
};
