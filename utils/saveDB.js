import { connectDB, disconnectDB } from "../db/connect.js";
import { TLDR, ID } from "../models/post.js";
import crawler from "./crawler.js";

(async () => {
  try {
    await connectDB();
    const data = await crawler();

    const promise = async () => {
      try {
        await TLDR.updateOne({}, { posts: data }, { upsert: true });
      } catch (err) {
        console.error(err);
      }
    };

    await promise();
  } catch (err) {
    console.error(err);
  } finally {
    disconnectDB();
  }
})();
