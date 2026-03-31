import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./db";
import { router } from "./routes";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/api/v1", router);

const start = async () => {
  console.log(process.env.NODE_ENV);
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
};

start();
