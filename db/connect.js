import mongoose from "mongoose";
import { config } from "dotenv";

config();

const uri = `mongodb+srv://hosmimam:${process.env.MONGO_DB_PW}@cluster0.u88ojk6.mongodb.net/?retryWrites=true&w=majority`;

export const connectDB = () => {
  return mongoose.connect(uri);
};

export const disconnectDB = () => {
  mongoose.connection.close();
};
