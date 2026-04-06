import dotenv from "dotenv";
import { routes } from "./routes";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import { sequelizeInit } from "./plugins/db-plugin";
import cors from "@fastify/cors";
import { errorMiddleware } from "./middleware/error-middleware";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = Fastify({ logger: true });

app.register(cors, {
  origin: "*",
  credentials: true,
});
app.register(cookie);
app.register(routes, { prefix: "/api/v1" });
app.setErrorHandler(errorMiddleware);

const start = async () => {
  await app.register(sequelizeInit);

  app.listen({ port: Number(PORT), host: "0.0.0.0" }, (error, address) => {
    console.log("address", address);
    if (error) {
      app.log.error(error);
      process.exit(1);
    }
    console.log(`server started on address ${address}`);
  });
};

start();
