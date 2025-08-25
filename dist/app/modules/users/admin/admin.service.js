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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../../wallet/wallet.model");
const transaction_model_1 = require("../../transaction/transaction.model");
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({ role: "USER" }).populate("wallet", "_id balance status");
    const totalUsers = yield user_model_1.User.countDocuments({ role: "USER" });
    return {
        meta: {
            total: totalUsers
        },
        users: users
    };
});
const getAllAgents = () => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield user_model_1.User.find({ role: "AGENT" }).populate("wallet", "_id balance status");
    const totalAgent = yield user_model_1.User.countDocuments({ role: "AGENT" });
    return {
        meta: {
            total: totalAgent
        },
        agents: agent
    };
});
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.find().populate("user", "name phone role email");
    const total = yield wallet_model_1.Wallet.countDocuments();
    return {
        meta: {
            total: total,
        },
        Wallets: wallet,
    };
});
const getAllTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const sort = query.sortBy || "createdAt";
    // const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;
    //   const filter = {
    //     $or: [{ fromUser: userId }, { toUser: userId }],
    //   };
    const transactions = yield transaction_model_1.Transaction.find()
        .populate("fromUser", "name phone role")
        .populate("toUser", "name phone role")
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments();
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
exports.AdminService = {
    getAllUsers,
    getAllAgents,
    getAllWallets,
    getAllTransactions,
};
