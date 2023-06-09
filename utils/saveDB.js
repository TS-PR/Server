import { connectDB, disconnectDB } from "../db/connect.js";
import TLDR from "../models/post.js";
import crawler from "./crawler.js";

const saveTldrData = async () => {
  try {
    connectDB();
    const tldrData = await crawler();
    const promise = tldrData.map(async (el) => {
      try {
        await TLDR.updateOne({ section: el.section }, { posts: el.textData });
      } catch (err) {
        console.error(err);
      }
    });
    await Promise.all(promise);
    disconnectDB();
  } catch (err) {
    console.error(err);
    disconnectDB();
  }
};

saveTldrData();
