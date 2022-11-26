const express = require('express');
const { check } = require('express-validator');
const postsControllers = require('../controllers/posts-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth= require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', postsControllers.getPostById);

router.get('/user/:uid', postsControllers.getpostsByUserId);



router.use(checkAuth);

router.post('/', fileUpload.single('image'),[check('title').not().isEmpty(),
check('description').isLength({ min: 5 }),
check('address').not().isEmpty()],postsControllers.createPost);

router.patch('/:pid', [check('title').not().isEmpty(),check('description').isLength({ min: 5 })],postsControllers.updatePostbyId);

router.delete('/:pid', postsControllers.deletePostbyId);

module.exports = router;
