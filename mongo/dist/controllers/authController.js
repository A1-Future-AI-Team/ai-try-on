"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProfile = exports.validateLogin = exports.validateRegister = exports.updateProfile = exports.getProfile = exports.logout = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const express_validator_1 = require("express-validator");
const createSendToken = (user, statusCode, res) => {
    const token = user.generateJWT();
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        message: statusCode === 201 ? 'User registered successfully' : 'Login successful',
        data: {
            user,
            token,
        },
        timestamp: new Date().toISOString(),
    });
};
const register = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const { username, email, password } = req.body;
        const existingUser = await User_1.User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email or username already exists',
            });
        }
        const newUser = await User_1.User.create({
            username,
            email,
            password,
        });
        createSendToken(newUser, 201, res);
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to register user',
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }
        if (!user.isActive) {
            return res.status(401).json({
                status: 'error',
                message: 'Your account has been deactivated',
            });
        }
        createSendToken(user, 200, res);
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to login',
        });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
};
exports.logout = logout;
const getProfile = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }
        return res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to get user profile',
        });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        const { username, email } = req.body;
        const existingUser = await User_1.User.findOne({
            $and: [
                { _id: { $ne: req.user?._id } },
                { $or: [{ email }, { username }] },
            ],
        });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Username or email already exists',
            });
        }
        const user = await User_1.User.findByIdAndUpdate(req.user?._id, { username, email }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user,
            },
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to update profile',
        });
    }
};
exports.updateProfile = updateProfile;
exports.validateRegister = [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
];
exports.validateUpdateProfile = [
    (0, express_validator_1.body)('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
];
//# sourceMappingURL=authController.js.map