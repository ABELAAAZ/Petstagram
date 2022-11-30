const express = require('express');
const { check } = require('express-validator');
const postsControllers = require('../controllers/posts-controllers');
const commentsControllers= require('../controllers/comments-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth= require('../middleware/check-auth');
const router = express.Router();

router.use(checkAuth);

router.delete('/:pid/:cid', commentsControllers.deletecommentbyId);
router.get('/:pid', commentsControllers.getcommentsByPostId);

module.exports = router;
