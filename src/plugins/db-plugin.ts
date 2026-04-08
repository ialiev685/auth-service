import fp from "fastify-plugin";
import { sequelize } from "../db";
import { TokenModel, UserModel } from "../models";

export const sequelizeInit = fp(async (instance) => {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
    }
    instance.log.info("база данных инициализирована");
    instance.decorate("db", { sequelize, User: UserModel, Token: TokenModel });
    instance.addHook("onClose", async () => {
      await sequelize.close();
    });
  } catch (error) {
    instance.log.error(error);
    throw error;
  }
});
