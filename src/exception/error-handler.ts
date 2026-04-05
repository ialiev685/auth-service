import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  callback: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown> | unknown,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(callback(req, res, next)).catch(next);
  };
};
