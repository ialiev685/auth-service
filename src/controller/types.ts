import type {
  FastifyRequest,
  FastifyReply,
  RequestGenericInterface,
} from "fastify";
import type { REDIRECT_PARAM, UUID_PARAM } from "../routes";

export type RouteHandlerCustom<
  T extends RequestGenericInterface = RequestGenericInterface,
> = (req: FastifyRequest<T>, res: FastifyReply) => Promise<void>;

export interface RegisterType {
  Body: { email: string; password: string; redirectUrl: string };
}
export type LoginType = RegisterType;
export interface ActivateType {
  Querystring: {
    [REDIRECT_PARAM]: string;
  };

  Params: { [UUID_PARAM]: string };
}
export interface ForgotPasswordType {
  Body: { email: string; redirectUrl: string };
}
export interface ResetPasswordType {
  Body: { uuid: string; password: string };
}
