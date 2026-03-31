import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const db = new Sequelize({
  host: "db",
  username: process.env.DB_USERNAME ?? "",
  password: process.env.DB_PASSWORD ?? "",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME ?? "",
  dialect: "postgres",
});

const app = express();
const PORT = process.env.PORT || 8000;

const start = async () => {
  console.log(process.env.NODE_ENV);
  await db.authenticate();
  app.listen(PORT, () => {
    console.log(`your server started on port ${PORT}`);
  });
};

start();
