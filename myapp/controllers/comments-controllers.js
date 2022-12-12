const HttpError = require("../models/http-errors");
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const comment = require("../models/comment");

// make a post
const createComment = async (req, res, next) => {
  const { comment } = req.body;
  const createdComment = new Comment({
    creator: req.userData.userId,
    post: req.params.pid,
    content: comment,
  });

  let post;
  try {
    post = await Post.findById(req.params.pid);
  } catch (err) {
    const error = new HttpError("Invalid input,check again", 422);
    return next(error);
  }

  if (!post) {
    const error = new HttpError("We could not find post", 404);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdComment.save({ session: sess });
    post.comments.push(createdComment);
    await post.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Comment failed, please try again", 500);
    return next(error);
  }
  res.status(201).json({ comment: createdComment });
};

// get comment by postid
const getcommentsByPostId = async (req, res, next) => {
  const postId = req.params.pid;
  let comments;
  try {
    comments = await Comment.find({ post: postId }).sort({ dateCreated: -1 });
  } catch (err) {
    const error = new HttpError("Fetching went wrong, try again", 500);
    return next(error);
  }

  res.json({
    comments: comments.map((comment) => comment.toObject({ getters: true })),
  });
};

// delete a comment
const deletecommentbyId = async (req, res, next) => {
  const commentId = req.params.cid; // const title =req.body.title
  const postId = req.params.pid;

  let comment;

  try {
    comment = await Comment.findById(commentId).populate("post");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try to update again111",
      500
    );
    return next(error);
  }

  if (!comment) {
    const error = new HttpError("We dont have this comment", 404);
    return next(error);
  }

  try {
    console.log(comment.post);
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await comment.remove({ session: sess });
    comment.post.comments.pull(comment);
    await comment.post.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try to delete again",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "delete successful" });
};

exports.createComment = createComment;
exports.getcommentsByPostId = getcommentsByPostId;
exports.deletecommentbyId = deletecommentbyId;
