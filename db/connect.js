import mongoose from "mongoose";

export const connectDB = (env) => {
  const uri = `mongodb+srv://hosmimam:${env}@cluster0.u88ojk6.mongodb.net/?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};

export const disconnectDB = () => {
  mongoose.connection.close();
};

console.log(connectDB());
