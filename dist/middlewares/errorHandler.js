"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const ErrorHandler = (error, req, res, next) => {
    return res.status(500).json({ message: error.message || 'Something went wrong' });
};
exports.ErrorHandler = ErrorHandler;
