"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'You are not logged in! Please log in to get access.',
            });
        }
        const jwtSecret = process.env.JWT_SECRET || '34ff870576ff2fea00351437e8c5bf6f14c955a7ff893fb09e1941a1c89b0d85b03d25168d6425efe3da8c900b8d4fa95c2be1351b877d6b92e3e8ef14d0a2a2';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const currentUser = await User_1.User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: 'error',
                message: 'The user belonging to this token does no longer exist.',
            });
        }
        req.user = currentUser;
        next();
    }
    catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token. Please log in again!',
        });
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to perform this action',
            });
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=auth.js.map