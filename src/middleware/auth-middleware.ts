import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../exception/api-errors";
import type { UserDto } from "../dto/user";
import { tokenService } from "../services/token-service";

const isUser = (value: unknown): value is UserDto => {
  return typeof value === "object" && value !== null && "email" in value;
};

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!authHeader || !token) {
      return next(ApiError.UnauthorizedError());
    }
    const decodedToken = tokenService.verifyAccessToken(token);

    if (isUser(decodedToken)) {
      req.user = decodedToken;
      return next();
    }
    next(ApiError.UnauthorizedError());
  } catch (_error) {
    next(ApiError.UnauthorizedError());
  }
};
