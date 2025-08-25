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
exports.AdminController = void 0;
const catchAsync_1 = require("../../../ulits/catchAsync");
const sendResponse_1 = __importDefault(require("../../../ulits/sendResponse"));
const admin_service_1 = require("./admin.service");
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield admin_service_1.AdminService.getAllUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved Successfully",
        data: users
    });
}));
const getAllAgents = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agents = yield admin_service_1.AdminService.getAllAgents();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Agents retrieved Successfully",
        data: agents
    });
}));
const getAllWallets = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield admin_service_1.AdminService.getAllWallets();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Wallets retrieved Successfully",
        data: wallets
    });
}));
const getAllTransactions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const transactions = yield admin_service_1.AdminService.getAllTransactions(query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All Transactions retrieved Successfully",
        data: transactions
    });
}));
exports.AdminController = {
    getAllUsers,
    getAllAgents,
    getAllWallets,
    getAllTransactions,
};
