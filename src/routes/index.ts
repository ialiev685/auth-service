import { Router } from "express";
import { controller } from "../controller";
import { errorHandler } from "../exception/error-handler";
import { authMiddleware } from "../middleware/auth-middleware";
import { body } from "express-validator";

export const router = Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Пароль должен быть не менее 8 символов"),
  errorHandler(controller.register),
);
router.get("/activate/:link", errorHandler(controller.activate));
router.post("/login", body("email").isEmail(), errorHandler(controller.login));
router.post("/refresh", errorHandler(controller.refresh));
router.get(
  "/currentUser",
  authMiddleware,
  errorHandler(controller.currentUser),
);
