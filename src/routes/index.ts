import { Router } from "express";
import { controller } from "../controller";
import { errorHandler } from "../middleware/error-handler";

export const router = Router();

router.post("/register", errorHandler(controller.register));
router.post("/login", (req, res, next) => {});
