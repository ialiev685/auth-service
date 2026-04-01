import type { Request, Response } from "express";
import { userService } from "../services/user-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exception/api-errors";
const REFRESH_TOKEN_KEY = "refreshToken";

class Controller {
  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 5,
    });
  }
  async register(req: Request, res: Response) {
    const checkResult = validationResult(req);
    if (!checkResult.isEmpty()) {
      throw ApiError.BadRequestError("Данные не валидны", checkResult.array());
    }
    const { email, password } = req.body;
    const { refreshToken, ...userData } = await userService.register(
      email,
      password,
    );

    this.setRefreshTokenCookie(res, refreshToken);
    return res.status(201).json(userData);
  }

  async login(req: Request, res: Response) {
    const checkResult = validationResult(req);
    if (!checkResult.isEmpty()) {
      throw ApiError.BadRequestError("Данные не валидны", checkResult.array());
    }
    const { email, password } = req.body;
    const { refreshToken, ...userData } = await userService.login(
      email,
      password,
    );

    this.setRefreshTokenCookie(res, refreshToken);
    return res.status(200).json(userData);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const { refreshToken: newRefreshToken, ...userData } =
      await userService.refresh(refreshToken);
    this.setRefreshTokenCookie(res, newRefreshToken);
    return res.status(200).json(userData);
  }

  async currentUser(req: Request, res: Response) {
    const user = await userService.getUser(req.user);
    return res.status(200).json(user);
  }
}

export const controller = new Controller();
