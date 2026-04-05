import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  host: "db",
  username: process.env.DB_USERNAME ?? "",
  password: process.env.DB_PASSWORD ?? "",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME ?? "",
  dialect: "postgres",
  logging: false,
});
