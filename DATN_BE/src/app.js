import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import router from "./routers/index.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors(
  //   {
  //   origin: "http://localhost:5173",
  //   methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  //   optionsSuccessStatus: 204,
  //   ocredentials: true,
  // }
  )
);

app.use("/api", router);

connectDB(process.env.MONGODB_URL);

app.use("/api", router);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});

export const viteNodeApp = app;
