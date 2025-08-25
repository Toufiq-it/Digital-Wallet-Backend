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
exports.AgentService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../../errorHelpers/AppError"));
const wallet_model_1 = require("../../wallet/wallet.model");
const transaction_model_1 = require("../../transaction/transaction.model");
const transaction_interface_1 = require("../../transaction/transaction.interface");
// Cash In
const cashIn = (agentId, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Verify agent
        const agent = yield user_model_1.User.findById(agentId).session(session).populate("wallet", "balance status");
        if (!agent || agent.role !== "AGENT") {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only agents can perform Cash-In");
        }
        if (agent.wallet.status === "SUSPENDED") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent Wallet is Suspend, Not ready to Cash-In");
        }
        // Find user wallet
        const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        if (!wallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet not found");
        }
        if (wallet.status === "BLOCKED") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is not active");
        }
        // Update balance
        wallet.balance += amount;
        yield wallet.save({ session });
        // transaction
        yield transaction_model_1.Transaction.create([{
                type: transaction_interface_1.TransactionType.CASH_IN,
                amount,
                // fee,
                fromUser: agentId,
                toUser: userId,
                initiatedBy: agentId,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
                meta: { method: "Agent Cash-In" },
            }], { session });
        yield session.commitTransaction();
        session.endSession();
        return wallet;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
// Cash Out
const cashOut = (agentId, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Verify agent
        const agent = yield user_model_1.User.findById(agentId).session(session);
        if (!agent || agent.role !== "AGENT") {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only agents can perform cash-out");
        }
        if (agent.wallet.status === "SUSPENDED") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent Wallet is Suspend, Not ready to Cash-In");
        }
        // Find user wallet
        const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        if (!wallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet not found");
        }
        if (wallet.status === "BLOCKED") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is not active");
        }
        // Fee (10%)
        const fee = Math.ceil(amount * 0.1);
        const debit = amount + fee;
        if (wallet.balance < debit) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
        }
        // Update balance
        wallet.balance -= debit;
        yield wallet.save({ session });
        // Transaction
        yield transaction_model_1.Transaction.create([{
                type: transaction_interface_1.TransactionType.CASH_OUT,
                amount,
                fee,
                fromUser: userId,
                toUser: agentId,
                initiatedBy: userId,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
                meta: { method: "Agent Cash-Out" },
            }], { session });
        yield session.commitTransaction();
        session.endSession();
        return wallet;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
// View My Transaction History
const agentTransactions = (agentId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const sort = query.sortBy || "createdAt";
    // const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;
    const filter = {
        $or: [{ fromUser: agentId }, { toUser: agentId }],
    };
    const transactions = yield transaction_model_1.Transaction.find(filter)
        .populate("fromUser", "name phone role")
        .populate("toUser", "name phone role")
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments(filter);
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: transactions,
    };
});
// agent wallet status update
const suspendedWallet = (agentId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(agentId).populate("wallet", "_id balance status");
    if (!user || user.role !== "AGENT") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent not found");
    }
    const updateAgent = user.wallet;
    updateAgent.status = status;
    yield updateAgent.save();
    return user;
});
exports.AgentService = {
    cashIn,
    cashOut,
    agentTransactions,
    suspendedWallet,
};
