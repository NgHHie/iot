import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { initMqtt } from "./config/mosquitto.js";
import { initSocketIO, getSocketIO } from "./config/socketio.js";
import { connection } from "./config/connectDB.js";
import apiRoutes from "./routes/api.js";
import swaggerDocs from "./swagger.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*", // Cho phép từ nguồn này
  })
);

/* ROUTES */
app.use("/api", apiRoutes);

/* OTHERS SETUP */
const server = http.createServer(app);
const PORT = process.env.PORT || 9000;
const startServer = async () => {
  try {
    await connection();
    await initSocketIO(server);
    await initMqtt(getSocketIO());

    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
      swaggerDocs(app, PORT);
    });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

startServer();
