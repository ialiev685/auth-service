import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const start = () => {
  console.log(process.env.NODE_ENV);
  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
};

start();
