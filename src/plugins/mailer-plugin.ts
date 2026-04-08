import fp from "fastify-plugin";
import { createTransport } from "nodemailer";

export const transporterInit = fp((instance) => {
  try {
    const transporter = createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    instance.decorate("transporter", transporter);
    instance.log.info("транспортер инициализирован");
  } catch (error) {
    instance.log.error(error);
    throw error;
  }
});
