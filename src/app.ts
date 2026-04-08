import dotenv from "dotenv";
import { routes } from "./routes";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import { sequelizeInit } from "./plugins/db-plugin";
import cors from "@fastify/cors";
import { errorMiddleware } from "./middleware/error-middleware";
import { transporterInit } from "./plugins/mailer-plugin";
import { ApiError } from "./exception/api-errors";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = Fastify({
  logger: true,
  schemaErrorFormatter: (error) => {
    return ApiError.ValidationError(error.at(0)?.message);
  },
});

app.register(cors, {
  origin: "*",
  credentials: true,
});
app.register(cookie);
app.register(transporterInit);
app.register(routes, { prefix: "/api/v1" });
app.setErrorHandler(errorMiddleware);

const start = async () => {
  await app.register(sequelizeInit);

  app.listen({ port: Number(PORT), host: "0.0.0.0" }, (error, address) => {
    if (error) {
      app.log.error(error);
      process.exit(1);
    }
    console.log(`server started on address ${address}`);
  });
};

start();
