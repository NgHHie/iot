import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import initModels from "../models/index.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

// Khởi tạo các mô hình
const models = initModels(sequelize);

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync(); // Tạo bảng nếu chưa tồn tại
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connection, sequelize, models };
