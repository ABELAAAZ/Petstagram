const express = require('express');
const { check } = require('express-validator');
const postsControllers = require('../controllers/posts-controllers');
const commentsControllers= require('../controllers/comments-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth= require('../middleware/check-auth');

const router = express.Router();

router.get('/', postsControllers.getPosts);

router.use(checkAuth);

router.get('/:pid', postsControllers.getPostById);

router.get('/user/:uid', postsControllers.getpostsByUserId);

router.post('/:pid/comment',[check('comment').isLength({ min: 2 })],commentsControllers.createComment);

router.post('/', 
fileUpload.single('image'),
[check('title').not().isEmpty(),
check('description').isLength({ min: 5 }),
check('address').not().isEmpty()],postsControllers.createPost);

router.patch('/:pid', [check('title').not().isEmpty(),check('description').isLength({ min: 5 })],postsControllers.updatePostbyId);
router.delete('/:pid', postsControllers.deletePostbyId);

module.exports = router;