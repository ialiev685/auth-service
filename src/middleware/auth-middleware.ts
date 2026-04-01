import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../exception/api-errors";
import jwt from "jsonwebtoken";
import type { UserDto } from "../dto/user";

const isUser = (value: unknown): value is UserDto => {
  return typeof value === "object" && value !== null && "email" in value;
};

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!authHeader || !token) {
    return next(ApiError.Unauthorized());
  }
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET ?? "");
  if (isUser(decodedToken)) {
    req.user = decodedToken;
    return next();
  }

  next(ApiError.Unauthorized());
};
