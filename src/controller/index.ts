import { UserService } from "../services/user-service";

import { ApiError } from "../exception/api-errors";
import { REDIRECT_PARAM, UUID_PARAM } from "../routes";
import type {
  ActivateType,
  ForgotPasswordType,
  LoginType,
  RegisterType,
  ResetPasswordType,
  RouteHandlerCustom,
} from "./types";
import type { FastifyInstance, FastifyReply } from "fastify";

const formatQueryAndParamToString = (
  value?: string | unknown | unknown[],
): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

export class Controller {
  private readonly REFRESH_TOKEN_AGE = 1000 * 60 * 5;
  private readonly REFRESH_TOKEN_KEY = "refreshToken";
  public readonly userService: UserService;

  constructor(fastifyInstance: FastifyInstance) {
    this.userService = new UserService(fastifyInstance);
  }

  private setRefreshTokenCookie = (res: FastifyReply, refreshToken: string) => {
    res.setCookie(this.REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_AGE,
      path: "/refresh",
      sameSite: "strict",
    });
  };

  public register: RouteHandlerCustom<RegisterType> = async (req, res) => {
    const { email, password, redirectUrl } = req.body;
    const { refreshToken, ...userData } = await this.userService.register(
      email,
      password,
      redirectUrl,
    );
    this.setRefreshTokenCookie(res, refreshToken);
    return res.status(201).send(userData);
  };

  public activate: RouteHandlerCustom<ActivateType> = async (req, res) => {
    const activationLink = formatQueryAndParamToString(req.params[UUID_PARAM]);
    const redirectLink = formatQueryAndParamToString(req.query[REDIRECT_PARAM]);
    await this.userService.activate(activationLink);

    if (redirectLink) {
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

  public login: RouteHandlerCustom<LoginType> = async (req, res) => {
    const { email, password } = req.body;
    const { refreshToken, ...userData } = await this.userService.login(
      email,
      password,
    );

    this.setRefreshTokenCookie(res, refreshToken);
    return res.status(200).send(userData);
  };

  public refresh: RouteHandlerCustom = async (req, res) => {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_KEY];
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const { refreshToken: newRefreshToken, ...userData } =
      await this.userService.refresh(refreshToken);
    this.setRefreshTokenCookie(res, newRefreshToken);
    return res.status(200).send(userData);
  };

  public currentUser: RouteHandlerCustom = async (req, res) => {
    if (!req.user) {
      throw ApiError.UnauthorizedError();
    }
    const user = await this.userService.getUser(req.user);
    return res.status(200).send(user);
  };

  public forgotPassword: RouteHandlerCustom<ForgotPasswordType> = async (
    req,
    res,
  ) => {
    const { email, redirectUrl } = req.body;
    await this.userService.forgotPassword(email, redirectUrl);
    return res.status(200).send();
  };

  public resetPassword: RouteHandlerCustom<ResetPasswordType> = async (
    req,
    res,
  ) => {
    const { password, uuid } = req.body;
    await this.userService.resetPassword(password, uuid);
    res.status(200).send();
  };
}
