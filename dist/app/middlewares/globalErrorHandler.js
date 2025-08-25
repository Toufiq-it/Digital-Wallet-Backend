"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const handleDublicateError_1 = require("../errorHelpers/handleDublicateError");
const handleCastError_1 = require("../errorHelpers/handleCastError");
const handleZodError_1 = require("../errorHelpers/handleZodError");
const handleValidationError_1 = require("../errorHelpers/handleValidationError");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const globalErrorHandler = (err, req, res, next) => {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log(err);
    }
    let statusCode = 500;
    let message = `Something went wrong ${err.message}`;
    let errorSources = [];
    // Duplicate error
    if (err.code === 11000) {
        const simplifiedError = (0, handleDublicateError_1.handleDublicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // ObjectId / cast error
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Zod error
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Mongoose validation error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.handleValidationError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // custom error handle
    else if (err instanceof AppError_1.default) {
        statusCode = err.statueCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        // backend dev er jonno nijer 2ta
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
