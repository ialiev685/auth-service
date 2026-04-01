import type { Request, Response } from "express";
import { userService } from "../services/user-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exception/api-errors";

const validateFields = (req: Request) => {
  const checkResult = validationResult(req);
  if (!checkResult.isEmpty()) {
    throw ApiError.BadRequestError("Данные не валидны", checkResult.array());
  }
};

class Controller {
  async register(req: Request, res: Response) {
    validateFields(req);
    const { email, password } = req.body;
    const { refreshToken, ...userData } = await userService.register(
      email,
      password,
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 5,
    });
    return res.status(201).json(userData);
  }

  async login(req: Request, res: Response) {
    validateFields(req);
    const { email, password } = req.body;
    const { refreshToken, ...userData } = await userService.login(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 5,
    });
    return res.status(200).json(userData);
  }

  async currentUser(req: Request, res: Response) {
    const user = await userService.getUser(req.user);
    return res.status(200).json(user);
  }
}

export const controller = new Controller();
