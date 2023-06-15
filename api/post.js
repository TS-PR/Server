import { getPost, getPostID } from "../controller/post.js";
import express from "express";

const router = express.Router();

router.get("/", getPost);
router.get("/id", getPostID);

export default router;
