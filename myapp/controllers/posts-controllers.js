const HttpError = require("../models/http-errors");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Post = require("../models/post");
const User = require("../models/user");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

// find a post by post id
const getPostById = async (req, res, next) => {
  const postId = req.params.pid;
  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError("sth went wrong,try again", 500);
    return next(error);
  }

  if (!post) {
    const error = new HttpError("Could not find the post of this post id", 404);
    return next(error);
  }
  res.json({ post: post.toObject({ getters: true }) }); // default: {post:post}
};

// find posts by user id
const getpostsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let posts, user;
  try {
    posts = await Post.find({ creator: userId });
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Fetching went wrong, try again", 500);
    return next(error);
  }
  if (!user) {
    return next(new HttpError("Something went wrong, try again", 500));
  }

  if (!posts || posts.length === 0) {
    return next(new HttpError("Could not find the post of this user", 404));
  }

  res.json({
    posts: posts.map((post) => post.toObject({ getters: true })),
    user: user,
  });
};

// make a post
const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid input,check again", 422));
  }
  const { title, description, address } = req.body; // const title =req.body.title
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    const error = new HttpError("coordinate failed", 422);
    return next(error);
  }

  const createdPost = new Post({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
    comments: [],
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Invalid input,check again", 422);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("We could not find user", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPost.save({ session: sess });
    user.posts.push(createdPost);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating failed, please try again", 500);
    return next(error);
  }
  res.status(201).json({ post: createdPost });
};

//update a post by post id
const updatePostbyId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid input,check again", 422));
  }
  const { title, description } = req.body; // const title =req.body.title
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try to update again",
      500
    );
    return next(error);
  }

  if (post.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this post", 401);
    return next(error);
  }

  post.title = title;
  post.description = description;

  try {
    await post.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try to update again",
      500
    );
    return next(error);
  }
  res.status(200).json({ post: post.toObject({ getters: true }) });
};

//delete a post by post id
const deletePostbyId = async (req, res, next) => {
  const postId = req.params.pid; // const title =req.body.title
  let post;
  try {
    post = await Post.findById(postId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try to update again",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError("We dont have this post", 404);
    return next(error);
  }

  if (post.creator.id !== req.userData.userId) {
    const error = new HttpError("You are not allowed to delete this post", 401);
    return next(error);
  }

  const imagePath = post.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await post.remove({ session: sess });
    post.creator.posts.pull(post);
    await post.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try to update again",
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "delete successful" });
};

exports.getpostsByUserId = getpostsByUserId;
exports.getPostById = getPostById;
exports.createPost = createPost;
exports.updatePostbyId = updatePostbyId;
exports.deletePostbyId = deletePostbyId;
