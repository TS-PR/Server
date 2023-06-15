import { connectDB, disconnectDB } from "../db/connect.js";
import { TLDR } from "../models/post.js";

const getPost = (req, res) => {
  const param = req.query;

  if (Object.keys(param).length !== 0) {
    getPostById(param, req, res);
  } else {
    getCategoryPost(req, res);
  }
};

const getCategoryPost = async (req, res) => {
  try {
    const data = await TLDR.aggregate([
      {
        $unwind: "$posts",
      },
      {
        $group: {
          _id: "$posts.section",
          data: { $push: "$posts" },
        },
      },
      {
        $project: {
          _id: 1,
          data: {
            $slice: [
              {
                $map: {
                  input: "$data",
                  as: "post",
                  in: "$$post",
                },
              },
              3,
            ],
          },
        },
      },
    ]);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPostID = async (req, res) => {
  try {
    const data = await TLDR.aggregate([
      { $unwind: "$posts" },
      { $project: { _id: 0, id: { $toString: "$posts.id" } } },
      { $group: { _id: null, result: { $push: "$id" } } },
      { $project: { _id: 0, result: 1 } },
    ]);

    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getPostById = async (param, req, res) => {
  try {
    const data = await TLDR.findOne(
      {},
      { posts: { $elemMatch: { id: param.id } } }
    );
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getPost, getPostID };
