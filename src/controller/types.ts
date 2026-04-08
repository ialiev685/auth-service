import type {
  FastifyRequest,
  FastifyReply,
  RequestGenericInterface,
} from "fastify";
import type { Type } from "@fastify/type-provider-typebox";
import type {
  registerSchema,
  activateSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas";

export type RouteHandlerCustom<
  T extends RequestGenericInterface = RequestGenericInterface,
> = (req: FastifyRequest<T>, res: FastifyReply) => Promise<void>;

export interface RegisterType {
  Body: Type.Static<(typeof registerSchema)["body"]>;
}
export type LoginType = RegisterType;
export interface ActivateType {
  Querystring: Type.Static<(typeof activateSchema)["querystring"]>;
  Params: Type.Static<(typeof activateSchema)["params"]>;
}
export interface ForgotPasswordType {
  Body: Type.Static<(typeof forgotPasswordSchema)["body"]>;
}
export interface ResetPasswordType {
  Body: Type.Static<(typeof resetPasswordSchema)["body"]>;
}
