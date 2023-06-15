import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tldrSchema = new Schema({
  posts: { type: Array, post: Object },
  createdAt: { type: Date, default: Date.now },
});

const TLDR = mongoose.model("TLDR", tldrSchema);

export { TLDR };
