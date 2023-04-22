import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tldrSchema = new Schema({
  section: String,
  posts: { type: Array, post: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("TLDR", tldrSchema);
