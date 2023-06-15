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
    origin: ["http://127.0.0.1:5500"], // 허용할 origin
    optionsSuccessStatus: 200, // 기본 요청 success code
    credentials: true, // reqeust credential이 포함되있을 경우 response에서 보여줄지 아닐지
  })
);

app.use("/api/post", postRouter);

process.on("exit", disconnectDB);

app.listen(8080);
