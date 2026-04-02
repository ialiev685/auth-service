import type { Request, Response } from "express";
import { userService } from "../services/user-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exception/api-errors";
import { REDIRECT_PARAM } from "../routes";

class Controller {
  private readonly REFRESH_TOKEN_AGE = 1000 * 60 * 5;
  private readonly REFRESH_TOKEN_KEY = "refreshToken";

  private setRefreshTokenCookie = (res: Response, refreshToken: string) => {
    res.cookie(this.REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_AGE,
      path: "/refresh",
      sameSite: "strict",
    });
  };

  private validateRequest = (req: Request) => {
    const checkResult = validationResult(req);
    if (!checkResult.isEmpty()) {
      throw ApiError.BadRequestError("Данные не валидны", checkResult.array());
    }
  };

  public register = async (req: Request, res: Response) => {
    this.validateRequest.bind(this)(req);
    const { email, password } = req.body;
    const redirectParam = req.query[REDIRECT_PARAM];
    const redirectUrl =
      typeof redirectParam === "string" ? redirectParam : undefined;
    const { refreshToken, ...userData } = await userService.register(
      email,
      password,
      redirectUrl,
    );
    this.setRefreshTokenCookie(res, refreshToken);
    return res.status(201).json(userData);
  };

  public activate = async (req: Request, res: Response) => {
    const activationLink =
      typeof req.params.link === "string" ? req.params.link : "";
    const redirectLink = req.query[REDIRECT_PARAM];
    await userService.activate(activationLink);

    if (typeof redirectLink === "string") {
      return res.redirect(
        !redirectLink.startsWith("http")
          ? "http://" + redirectLink
          : redirectLink,
      );
    }

    res
      .status(200)
      .send(
        `<h2 style="display: flex; justify-content: center;">✅ Активация прошла успешно!</h2>`,
      );
  };

  public login = async (req: Request, res: Response) => {
    this.validateRequest(req);
    const { email, password } = req.body;
    const { refreshToken, ...userData } = await userService.login(
      email,
      password,
    );

    this.setRefreshTokenCookie(res, refreshToken);
    return res.status(200).json(userData);
  };

  public refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_KEY];
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const { refreshToken: newRefreshToken, ...userData } =
      await userService.refresh(refreshToken);
    this.setRefreshTokenCookie(res, newRefreshToken);
    return res.status(200).json(userData);
  };

  public currentUser = async (req: Request, res: Response) => {
    if (!req.user) {
      throw ApiError.UnauthorizedError();
    }
    const user = await userService.getUser(req.user);
    return res.status(200).json(user);
  };
}

export const controller = new Controller();
