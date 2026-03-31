import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./db";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const start = async () => {
  console.log(process.env.NODE_ENV);
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
};

start();
