import { Router } from "express";
import { controller } from "../controller";
import { errorHandler } from "../exception/error-handler";
import { authMiddleware } from "../middleware/auth-middleware";
import { body, query } from "express-validator";

export const router = Router();
export const REDIRECT_PARAM = "redirect";

router.post(
  "/register",
  body("email").isEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Пароль должен быть не менее 8 символов"),
  query(REDIRECT_PARAM)
    .optional()
    .isURL()
    .withMessage("redirect должен быть валидным url"),
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
