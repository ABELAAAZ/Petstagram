const HttpError = require('../models/http-errors');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// get all users
const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError('fetching failed, try again', 500);
        return next(error);
    }
    res.json({ user: users.map(user => user.toObject({ getters: true })) });
};


// sign up
const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        console.log(errors);
        return next(new HttpError('Invalid input,check again', 422));
    };
    const { name, email, password } = req.body;

    let existedUser
    try {
        existedUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError('Creating went wrong, try again', 500);
        return next(error);
    }

    if (existedUser) {
        const error = new HttpError('User exists already,please login instead', 422);
        return next(error);
    };


    const creatUser = new User({
        name,
        email,
        password: password,
        image: req.file.path,
        posts: [],
        following:[]
    });

    try {
        await creatUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed, try again', 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ userId: creatUser.id, email: creatUser.email }, "supersecret_dont_share", { expiresIn: '1h' });
    } catch (err) {
        const error = new HttpError('could not create the  user', 500);
        return next(error);
    };
    res.status(201).json({ userId: creatUser.id, email: creatUser.email, token: token });
};


// login
const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existedUser
    try {
        existedUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError('Login went wrong, try again', 500);
        return next(error);

    }

    if (!existedUser) {
        const error = new HttpError('Check your email or password, try again', 401);
        return next(error);
    }

    if (password !== existedUser.password) {
        const error = new HttpError('check your password', 401);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ userId: existedUser.id, email: existedUser.email }, "supersecret_dont_share", { expiresIn: '1h' });

    } catch (err) {
        const error = new HttpError('Logging in failed', 500);
        return next(error);
    };

    res.json({ userId: existedUser.id, email: existedUser.email, token: token });
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
