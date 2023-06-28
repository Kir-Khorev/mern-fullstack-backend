import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.error("Err", err);
    res.status(500).json({ message: "Failed to get tags" });
  }
};

export const getAll = async (req, res) => {
  try {
    const { sortBy } = req.query;
    let sortOptions = {};

    if (sortBy === "viewsCount") {
      sortOptions = { viewsCount: "desc" };
    } else if (sortBy === "createdAt") {
      sortOptions = { createdAt: "desc" };
    }

    const posts = await PostModel.find()
      .sort(sortOptions)
      .populate("user")
      .exec();

    res.json(posts);
  } catch (error) {
    console.error("Err", err);
    res.status(500).json({ message: "Failed to get all articles" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findByIdAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    ).populate("user");

    if (!doc) {
      return res.status(404).json({
        message: "не удалось найти статью",
      });
    }

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get article",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({
        message: "Article not found...",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete article",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.error("Err", err);
    res.status(500).json({ message: "Failed to create article" });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update article",
    });
  }
};
