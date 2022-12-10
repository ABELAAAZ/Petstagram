const express = require('express');
const usersControllers = require('../controllers/users-controllers');
const { check } = require('express-validator');
const fileUpload = require('../middleware/file-upload');
const postsControllers = require("../controllers/posts-controllers");
const router = express.Router();

router.get('/', usersControllers.getUsers);

router.get('/:id', usersControllers.getUserById);

router.get('/user/:uid', usersControllers.getFollowingsByUserId);

router.post('/signup',
    fileUpload.single('image'),
    [check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),// normalizeEmail is to lowercast the character
    check('password').isLength({ min: 6 }),
    ], usersControllers.signup);

router.post('/login', usersControllers.login);

module.exports = router;
