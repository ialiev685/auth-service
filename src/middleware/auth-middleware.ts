import { ApiError } from "../exception/api-errors";
import { isUserDto } from "../dto/user";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Controller } from "../controller";

export const authMiddleware = (controller: Controller) => {
  return async (req: FastifyRequest, _res: FastifyReply) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(" ")[1];
      if (!authHeader || !token) {
        throw ApiError.UnauthorizedError();
      }
      const decodedToken =
        controller.userService.tokenService.verifyAccessToken(token);

      if (isUserDto(decodedToken)) {
        req.user = decodedToken;
        return;
      }

      throw ApiError.UnauthorizedError();
    } catch (_error) {
      throw ApiError.UnauthorizedError();
    }
  };
};
