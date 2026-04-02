import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./db";
import { router } from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error-middleware";
import morgan from "morgan";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1", router);
app.use(errorMiddleware);

const start = async () => {
  console.log(process.env.NODE_ENV);
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
};

start();
