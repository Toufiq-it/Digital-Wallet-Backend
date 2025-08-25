"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const catchAsync_1 = require("../../ulits/catchAsync");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../ulits/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const setCookie_1 = require("../../ulits/setCookie");
// credential login
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = yield auth_service_1.AuthServices.credentialsLogin(req.body);
    (0, setCookie_1.setAuthCookie)(res, loginInfo);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    });
}));
// refresh token
const getNewAccesstoken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No refresh token received from cookies");
    }
    const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo,
    });
}));
// logout
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged out Successfully",
        data: null,
    });
}));
// reset password
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedTokan = req.user;
    yield auth_service_1.AuthServices.resetPassword(oldPassword, newPassword, decodedTokan);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Changed Successfully",
        data: null,
    });
}));
exports.AuthControllers = {
    credentialsLogin,
    getNewAccesstoken,
    logout,
    resetPassword,
};
