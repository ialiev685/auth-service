import { Router } from "express";
import { controller } from "../controller";
import { errorHandler } from "../exception/error-handler";
import { authMiddleware } from "../middleware/auth-middleware";
import { body } from "express-validator";

export const router = Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  errorHandler(controller.register),
);
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  errorHandler(controller.login),
);
router.get(
  "/currentUser",
  authMiddleware,
  errorHandler(controller.currentUser),
);
