import type { FastifyInstance } from "fastify";

export class MailService {
  constructor(private fastifyInstance: FastifyInstance) {}

  public sendActivationLink = async (email: string, activationLink: string) => {
    try {
      const result = await this.fastifyInstance.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: `Активация на ${process.env.HOST}`,
        html: `<div>
                    <h2><b>Для активации перейдите по ссылке:</b></h2>
                    <a style="font-weight: bold; font-size: 16px;" href="${activationLink}">${activationLink}</a>
                </div>`,
      });

      return result.accepted;
    } catch (error) {
      console.log("nodemailer error", error);
      return [];
    }
  };

  public sendResetPasswordLink = async (
    email: string,
    resetPasswordLink: string,
  ) => {
    try {
      const result = await this.fastifyInstance.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: `Активация на ${process.env.HOST}`,
        html: `<div>
                    <h2><b>Для сброса пароля перейдите по ссылке:</b></h2>
                    <a style="font-weight: bold; font-size: 16px;" href="${resetPasswordLink}">${resetPasswordLink}</a>
                </div>`,
      });

      return result.accepted;
    } catch (error) {
      console.log("nodemailer error", error);
      return [];
    }
  };
}
