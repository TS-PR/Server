import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import postRouter from "./api/post.js";
import { connectDB, disconnectDB } from "./db/connect.js";

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));
app.use(helmet());

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.use("/api/post", postRouter);

process.on("exit", disconnectDB);

app.listen(8080);
