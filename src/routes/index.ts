import { Router } from "express";
import { controller } from "../controller";
import { errorHandler } from "../exception/error-handler";
import { authMiddleware } from "../middleware/auth-middleware";
import { body, param } from "express-validator";

export const router = Router();
export const REDIRECT_PARAM = "redirectUrl";
export const UUID_PARAM = "uuid";

router.post(
  "/register",
  body("email").isEmail(),
  body("password", "Пароль должен быть не менее 8 символов").isLength({
    min: 8,
  }),
  body(REDIRECT_PARAM, "redirectUrl должен быть валидным url")
    .optional()
    .isURL(),
  errorHandler(controller.register),
);
router.get(
  `/activate/:${UUID_PARAM}`,
  param(UUID_PARAM).isUUID(),
  errorHandler(controller.activate),
);
router.post("/login", body("email").isEmail(), errorHandler(controller.login));
router.post(
  "/forgotPassword",
  body("email").isEmail(),
  body(REDIRECT_PARAM).isURL(),
  errorHandler(controller.forgotPassword),
);
router.post(
  "/resetPassword",
  body("password", "Пароль должен быть не менее 8 символов").isLength({
    min: 8,
  }),
  body(UUID_PARAM).isUUID(),
  errorHandler(controller.resetPassword),
);
router.post("/refresh", errorHandler(controller.refresh));
router.get(
  "/currentUser",
  authMiddleware,
  errorHandler(controller.currentUser),
);
