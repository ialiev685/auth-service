import { ApiError } from "../exception/api-errors";
import type { FastifyReply, FastifyRequest } from "fastify";

export const errorMiddleware = (
  err: unknown,
  req: FastifyRequest,
  res: FastifyReply,
) => {
  if (err instanceof ApiError) {
    return res
      .status(err.code)
      .send({ message: err.message, errors: err.errors });
  }
  req.server.log.error(err);
  return res
    .status(500)
    .send({ message: "Непредвиденная ошибка", errors: err });
};
