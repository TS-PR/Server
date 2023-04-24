import { connectDB, disconnectDB } from "../db/connect.js";
import TLDR from "../models/post.js";
import crawler from "./crawler.js";
import cron from "node-cron";
import { config } from "dotenv";

config();

const saveTldrData = async () => {
  try {
    await connectDB(process.env.MONGO_DB_PW);
    const tldrData = crawler()
      .then(() => console.log("login successed!"))
      .catch((err) => console.log(err));
    const promise = tldrData.map(async (el) => {
      try {
        await TLDR.updateOne({ section: el.section }, { posts: el.textData });
      } catch (err) {
        console.error(err);
      }
    });
    await Promise.all(promise);
  } catch (err) {
    console.error(err);
  } finally {
    disconnectDB();
    console.log("성공!");
  }
};

cron.schedule("0 8 * * *", () => {
  saveTldrData();
});
