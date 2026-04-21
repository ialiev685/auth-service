import type { Sequelize } from 'sequelize';
import type { UserModel, TokenModel, RoleModel } from '../models';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

declare module 'fastify' {
  interface FastifyInstance {
    db: {
      sequelize: Sequelize;
      User: typeof UserModel;
      Token: typeof TokenModel;
      Role: typeof RoleModel;
    };
    transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
  }

  interface FastifyRequest {
    user?: UserDto | null;
  }
}
