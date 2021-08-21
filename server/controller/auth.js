const crypto = require('crypto');
const brcypt = require('bcryptjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const authMiddleWare = require('../middleware/auth');
const userJson = require('../data/user.json');
const { log } = require('console');

// @desc     Register user
// @route    POST /api/v1/auth/register
// @access   public
exports.register = asyncHandler(async (req, res, next) => {
    const { user_name, email, password } = req.body;
    //Check user_name already exits
    let user_count;

    try {
        const user = fs.readFileSync(__dirname + "/../data/user.json");
        const userData = JSON.parse(user);

        // Check if user exists
        if (Object.keys(userData).indexOf(email) !== -1) {
            return next(new ErrorResponse('User already exist, kindly select different user name', 401));
        }

        const salt = await brcypt.genSalt(10);

        // Hashing Password
        let user_password = await brcypt.hash(password, salt);

        // Create User
        userData[email] = { user_name, email, password: user_password, food: [] };

        fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(userData), (err) => {
            if (err) {
                return next(new ErrorResponse('Something went wrong', 500));

            } else {
                sendTokenResponse(userData[email], 200, res);
            }

        })

    } catch (err) {
        return next(new ErrorResponse('Something went wrong', 500));
    }

})

// @desc     Login
// @route    POST /api/v1/auth/login
// @access   public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    try {
        const user = fs.readFileSync(__dirname + "/../data/user.json");
        const userData = JSON.parse(user);

        //Check for User
        if (Object.keys(userData).indexOf(email) === -1) {
            return next(new ErrorResponse('User not found', 401));
        }

        const userJson = userData[email];

        //Check if password matches
        const isMatch = await brcypt.compare(password, userJson.password);

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        sendTokenResponse(userJson, 200, res);

    } catch (error) {
        return next(new ErrorResponse('Something went wrong', 500));
    }

})

// @desc     Log user out / clear cookie
// @route    GET /api/v1/auth/logout
// @access   private
exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        data: {}
    })
})

// @desc     Get current logged in user
// @route    POST /api/v1/auth/me
// @access   private
exports.getMe = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = fs.readFileSync(__dirname + "/../data/user.json");
        const userData = JSON.parse(user);

        const userJson = userData[email];
        delete userJson.password;

        res.status(200).json({
            success: true,
            data: userJson
        })

    } catch (error) {
        return next(new ErrorResponse('Something went wrong', 500));
    }

})

// @desc     Forgot password
// @route    POST /api/v1/auth/forgotpassword
// @access   public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const user = fs.readFileSync(__dirname + "/../data/user.json");
        const userData = JSON.parse(user);

        //Check for User
        if (Object.keys(userData).indexOf(email) === -1) {
            return next(new ErrorResponse('User not found', 401));
        }

        const salt = await brcypt.genSalt(10);

        // Hashing Password
        let user_password = await brcypt.hash(password, salt);

        userData[email].password = user_password;

        fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(userData), (err) => {
            if (err) {
                return next(new ErrorResponse('Something went wrong', 500));

            } else {
                res.status(200).json({
                    success: true,
                    data: 'Password changed, Kindly login'
                })
            }

        })


    } catch (error) {
        return next(new ErrorResponse('Something went wrong', 500));
    }

})

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token 
    const token = authMiddleWare.getSignedJwtToken(user.email);

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}