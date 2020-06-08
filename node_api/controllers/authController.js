const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const expressJwt = require('express-jwt');    // For protecting Routes
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

const createSendToken = (user, statusCode, res) => {
    const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN} );

    const cookieOptions = {
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 ),
        httpOnly: true
    };

    res.cookie('jwt', token, cookieOptions);

    // Do not output these
    user.password = undefined;
    user.created = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
          user
        }
    });
};

exports.signup = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email});

        if(user) {
            return res.status(403).json({
                error: 'User already exists with that Email'
            });
        }

        const newUser = await User.create(req.body);

        // Do not output these
        newUser.password = undefined;
        newUser.created = undefined;

        res.status(201).json({
            status: 'success',
            data: {
                newUser
            }
        });
    } catch(err) {
        // console.log(err);
        res.status(400).json({
            error: err.message
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Check if provided email and password exists or not
        if(!email || !password) {
            return res.status(400).json({
                error: 'Please provide an email and password'
            });
        }

        // 2. Check if user exists and password is correct
        const user = await User.findOne({email}).select('+password');
        if(!user) {
            return res.status(401).json({
                error: 'Please register first...'
            });
        }

        const valid = await user.authenticate(password,user.password);

        // Here user.password is hashed and password is not
        if(!valid) {
            return res.status(401).json({
                error: 'Incorrect Email or Password'
            });
        }

        // 3. If user exists then send a token
        createSendToken(user, 200, res);

    } catch(err) {
        res.status(400).json({
            error: err
        });
    }
};

exports.logout = async (req, res, next) => {
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: 'Successfully loggedOut..'
    });
};

exports.protect = async (req, res, next) => {
    // 1. Getting token and check if it exists or not
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if(req.cookies.jwt) {
    //     token = req.cookies.jwt;
    // }

    if(!token) {
        return res.status(401).json({
            error: 'Please Login first...'
        });
    }

    // 2. Verfication of token
    const decode_token = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

    // 3. Check if user still exists or not
    const currentUser = await User.findById(decode_token.userID);
    if(!currentUser) {
        return res.status(401).json({
            error: 'The user belonging to this token no longer exists...'
        });
    }

    // Grant access to protected route
    req.auth = currentUser;
    
    //console.log(currentUser);
    next();

};
