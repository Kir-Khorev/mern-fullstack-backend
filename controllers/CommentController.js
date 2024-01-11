import CommentModel from '../models/Comment.js';

export const getAll = async (req, res) => {
  try {
    const { sortBy } = req.query;
    let sortOptions = {};

    if (sortBy === 'viewsCount') {
      sortOptions = { viewsCount: 'desc' };
    } else if (sortBy === 'createdAt') {
      sortOptions = { createdAt: 'desc' };
    }

    const comments = await CommentModel.find().sort(sortOptions).exec();

    res.json(comments);
  } catch (error) {
    console.error('Err', error);
    res.status(500).json({ message: 'Failed to get all comments' });
  }
};

export const getAllByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { sortBy } = req.query;
    let sortOptions = {};

    if (sortBy === 'viewsCount') {
      sortOptions = { viewsCount: 'desc' };
    } else if (sortBy === 'createdAt') {
      sortOptions = { createdAt: 'desc' };
    }

    const comments = await CommentModel.find({ postId: postId })
      .sort(sortOptions)
      .exec();

    res.json(comments);
  } catch (error) {
    console.error('Err', error);
    res.status(500).json({ message: 'Failed to get all comments for post' });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await CommentModel.findByIdAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' }
    ).populate('user');

    if (!doc) {
      return res.status(404).json({
        message: 'не удалось найти comment',
      });
    }

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to get comment',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const commentId = req.params.id;

    const doc = await CommentModel.findOneAndDelete({ _id: commentId });

    if (!doc) {
      return res.status(404).json({
        message: 'Comment not found...',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to delete comment',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      name: req.body.name,
      photo: req.body.photo,
      text: req.body.text,
      postId: req.body.postId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (error) {
    console.error('Err', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await CommentModel.updateOne(
      {
        _id: postId,
      },
      {
        name: req.body.name,
        photo: req.body.photo,
        text: req.body.text,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to update comment',
    });
  }
};
