/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import express from "express";
import cors from "cors";
import config from "./configuration";
import requestLogger from "./utilities/requestLogger";
import database from "./configuration/databaseConfiguration";
import { GeneralRequest } from "./utilities/interfaces";
import router from "./routes";

const app = express();
const port = config.PORT || 3000;

app.use(cors());
app.use(express.json());

declare global {
  namespace Express {
    interface Request extends GeneralRequest { }
  }
}

app.use(requestLogger);
app.use("/api", router);

// GET request to homepage
app.get("/", (req, res) => {
  res.send(`Welcome to ${config.APP_NAME} api`);
});

// Global 404 error handler
app.use((req, res) => res.status(404).send({
  message: "Invalid Route, kindly check your route",
  error: "Not found"
}));

(async () => {
  console.log("Awaiting Database Connection...");
  await database.connect();
  console.log("Database connected successfully!!!");
  app.listen(port, async () => {
    console.log(
      `${config.APP_NAME} API listening on port: ${port}`
    );
  });
})();

export default app;
