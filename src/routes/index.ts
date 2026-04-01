import { Router } from "express";
import { controller } from "../controller";
import { errorHandler } from "../exception/error-handler";
import { authMiddleware } from "../middleware/auth-middleware";

export const router = Router();

router.post("/register", errorHandler(controller.register));
router.post("/login", errorHandler(controller.login));
router.get(
  "/currentUser",
  authMiddleware,
  errorHandler(controller.currentUser),
);
