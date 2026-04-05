import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../exception/api-errors";

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res
      .status(err.code)
      .json({ message: err.message, errors: err.errors });
  }

  return res
    .status(500)
    .json({ message: "Непредвиденная ошибка", errors: err });
};
