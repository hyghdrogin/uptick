import express from "express";
import cors from "cors";
import config from "./configuration";
import requestLogger from "./utilities/requestLogger";

const app = express();
const port = config.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(requestLogger);

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
  app.listen(port, async () => {
    console.log(
      `${config.APP_NAME} API listening on port: ${port}`
    );
  });
})();

export default app;
