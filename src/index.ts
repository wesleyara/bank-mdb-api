import express from "express";
const app = express();

import swaggerUi from "swagger-ui-express";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import router from "./routes";
import { connectToDatabase } from "./lib/db";
const swaggerDocument = require("../public/swagger.json");

const PORT = process.env.PORT || 3333;

app.use(
  cors({
    origin: "*",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(express.static("public"));

app.use("/api/v1", router);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectToDatabase()
  .then(() => {
    app.emit("ready");
  })
  .catch(error => {
    console.log(error);
  });

app.on("ready", () => {
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}. Access http://localhost:${PORT} to see the documentation.`,
    );
  });
});
