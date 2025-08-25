"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDublicateError = void 0;
const handleDublicateError = (err) => {
    const matchArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchArray[1]} already exist !!`
    };
};
exports.handleDublicateError = handleDublicateError;
