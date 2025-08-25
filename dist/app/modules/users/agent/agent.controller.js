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
exports.AgentController = void 0;
const catchAsync_1 = require("../../../ulits/catchAsync");
const agent_service_1 = require("./agent.service");
const sendResponse_1 = __importDefault(require("../../../ulits/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../../errorHelpers/AppError"));
const cashIn = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //   const agentId = req.user.userId;
    const decodeToken = req.user;
    const agentId = decodeToken.userId;
    const { userId, amount } = req.body;
    const wallet = yield agent_service_1.AgentService.cashIn(agentId, userId, amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Cash-in successful",
        data: wallet,
    });
}));
const cashOut = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const agentId = req.user.userId;
    const decodeToken = req.user;
    const agentId = decodeToken.userId;
    const { userId, amount } = req.body;
    const wallet = yield agent_service_1.AgentService.cashOut(agentId, userId, amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Cash-out successful",
        data: wallet,
    });
}));
const agentTransactions = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const agentId = decodeToken.userId;
    const query = req.query;
    const transactions = yield agent_service_1.AgentService.agentTransactions(agentId, query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "My Transaction history",
        data: transactions,
    });
}));
// agent wallet update
const suspendedWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId, status } = req.body;
    if (status === "ACTIVE" || status === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "The Agent will only be APPROVED or SUSPENDED");
    }
    const agent = yield agent_service_1.AgentService.suspendedWallet(agentId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Agent Wallet status updated",
        data: agent
    });
}));
exports.AgentController = {
    cashIn,
    cashOut,
    agentTransactions,
    suspendedWallet,
};
