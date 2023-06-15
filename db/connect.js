import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = `mongodb+srv://hosmimam:FfGiAwrFvYuN8xhz@cluster0.u88ojk6.mongodb.net/?retryWrites=true&w=majority`;

  await mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};
