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
exports.UserController = void 0;
const catchAsync_1 = require("../../../ulits/catchAsync");
const sendResponse_1 = __importDefault(require("../../../ulits/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const AppError_1 = __importDefault(require("../../../errorHelpers/AppError"));
// create user
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Created Successfully",
        data: user,
    });
}));
// get single user
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const user = yield user_service_1.UserService.getSingleUser(slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Retrived Successfully",
        data: user,
    });
}));
// user update
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user;
    const user = yield user_service_1.UserService.updateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
}));
// ---------------------User WALLET Controller-------------------
// Add money
const addMoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("req user",req.user);
    const decodeToken = req.user;
    const wallet = yield user_service_1.UserService.addMoney(req.body, decodeToken.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: 'Money added successfully',
        data: wallet,
    });
}));
// withdraw 
const withdraw = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const wallet = yield user_service_1.UserService.withdraw(req.body, decodeToken.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: 'Withdraw successfully',
        data: wallet,
    });
}));
// send money
const sendMoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const { receiverId, amount } = req.body;
    const wallet = yield user_service_1.UserService.sendMoney({ receiverId, amount }, decodeToken.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: 'Send-Money successfully',
        data: wallet,
    });
}));
// get my Transaction
const getMyTransactions = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const userId = decodeToken.userId;
    const query = req.query;
    const transactions = yield user_service_1.UserService.getMyTransactions(userId, query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "My Transaction history",
        data: transactions,
    });
}));
// user wallet status update
const blockWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, status } = req.body;
    if (status === "APPROVED" || status === "SUSPENDED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "The User will only be ACTIVE or BLOCKED");
    }
    const user = yield user_service_1.UserService.blockWallet(userId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User Wallet status updated",
        data: user
    });
}));
exports.UserController = {
    createUser,
    getSingleUser,
    updateUser,
    // user Wallet
    addMoney,
    withdraw,
    sendMoney,
    getMyTransactions,
    blockWallet,
};
