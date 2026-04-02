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
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  public send = async (email: string) => {
    try {
      const result = await this.transporter.sendMail({
        from: process.env.MAIL_USER1,
        to: email,
        subject: "Подтвердите почту",
        html: "<b>Hello world?</b>",
      });

      return result.accepted;
    } catch (_error) {
      return [];
    }
  };
}

export const mailService = new MailService();
