import { connectDB, disconnectDB } from "../db/connect.js";
import TLDR from "../models/post.js";
import crawler from "./crawler.js";

const saveTldrData = async () => {
  try {
    await connectDB();
    const tldrData = await crawler();

    const promise = tldrData.map(async (el) => {
      try {
        await TLDR.updateOne({ section: el.section }, { posts: el.textData });
      } catch (err) {
        console.error(err);
      }
    });
    await Promise.all(promise);
    console.log("성공!");
    disconnectDB();
  } catch (err) {
    console.error(err);
  }
};

export default saveTldrData;
