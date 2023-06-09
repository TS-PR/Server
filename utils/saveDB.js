import { connectDB, disconnectDB } from "../db/connect.js";
import TLDR from "../models/post.js";
import crawler from "./crawler.js";

const saveTldrData = async () => {
  try {
    connectDB().then(async () => {
      const tldrData = await crawler();
      const promise = tldrData.map(async (el) => {
        await TLDR.updateOne({ section: el.section }, { posts: el.textData });
      });
      4;
      await Promise.all(promise);
      disconnectDB();
    });
  } catch (err) {
    console.error(err);
    disconnectDB();
  }
};

saveTldrData();
