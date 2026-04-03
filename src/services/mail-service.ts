import type { Transporter } from "nodemailer";
import { createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

class MailService {
  private transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor() {
    this.transporter = createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  public sendActivationLink = async (email: string, activationLink: string) => {
    try {
      const result = await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: `Активация на ${process.env.HOST}`,
        html: `<div>
                    <h2><b>Для активации перейдите по ссылке:</b></h2>
                    <a href="${activationLink}">${activationLink}</a>
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
      const result = await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: `Активация на ${process.env.HOST}`,
        html: `<div>
                    <h2><b>Для сброса пароля перейдите по ссылке:</b></h2>
                    <a href="${resetPasswordLink}">${resetPasswordLink}</a>
                </div>`,
      });

      return result.accepted;
    } catch (error) {
      console.log("nodemailer error", error);
      return [];
    }
  };
}

export const mailService = new MailService();
