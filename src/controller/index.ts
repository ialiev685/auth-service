import type { Request, Response } from "express";
import { userService } from "../services/user-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exception/api-errors";
const REFRESH_TOKEN_KEY = "refreshToken";

class Controller {
  private readonly REFRESH_TOKEN_AGE = 1000 * 60 * 5;

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_AGE,
      path: "/refresh",
      sameSite: "strict",
    });
  }

  private validateRequest(req: Request) {
    const checkResult = validationResult(req);
    if (!checkResult.isEmpty()) {
      throw ApiError.BadRequestError("Данные не валидны", checkResult.array());
    }
  }

  public async register(req: Request, res: Response) {
    this.validateRequest(req);
    const { email, password } = req.body;
    const { refreshToken, ...userData } = await userService.register(
      email,
      password,
    );

    this.setRefreshTokenCookie(res, refreshToken);
    return res.status(201).json(userData);
  }

  public async login(req: Request, res: Response) {
    this.validateRequest(req);
    const { email, password } = req.body;
    const { refreshToken, ...userData } = await userService.login(
      email,
      password,
    );

    this.setRefreshTokenCookie(res, refreshToken);
    return res.status(200).json(userData);
  }

  public async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const { refreshToken: newRefreshToken, ...userData } =
      await userService.refresh(refreshToken);
    this.setRefreshTokenCookie(res, newRefreshToken);
    return res.status(200).json(userData);
  }

  public async currentUser(req: Request, res: Response) {
    if (!req.user) {
      throw ApiError.UnauthorizedError();
    }
    const user = await userService.getUser(req.user);
    return res.status(200).json(user);
  }
}

export const controller = new Controller();
