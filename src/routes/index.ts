import { Controller } from '../controller';
import type { FastifyPluginCallback } from 'fastify';
import { authMiddleware } from '../middleware/auth-middleware';
import {
  activateSchema,
  currentUserSchema,
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
} from '../schemas';

export const REDIRECT_PARAM = 'redirectUrl' as const;
export const UUID_PARAM = 'uuid' as const;

export const routes: FastifyPluginCallback = (instance, _options, done) => {
  const controller = new Controller(instance);
  instance.post('/register', { schema: registerSchema }, controller.register);
  instance.get(`/activate/:${UUID_PARAM}`, { schema: activateSchema }, controller.activate);
  instance.post('/login', { schema: loginSchema }, controller.login);
  instance.post('/forgotPassword', { schema: forgotPasswordSchema }, controller.forgotPassword);
  instance.post('/resetPassword', { schema: resetPasswordSchema }, controller.resetPassword);
  instance.post('/refresh', { schema: refreshSchema }, controller.refresh);
  instance.get(
    '/currentUser',
    { preHandler: authMiddleware(controller), schema: currentUserSchema },
    controller.currentUser,
  );
  instance.post(
    '/logout',
    { preHandler: authMiddleware(controller), schema: logoutSchema },
    controller.logout,
  );
  done();
};
