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
exports.WalletService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const wallet_model_1 = require("./wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// get own Wallet
const getMyWallet = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === "ADMIN") {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Admins cannot use this endpoint, they have another endpoint to view all wallets");
    }
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).populate("user", "name email role");
    if (!wallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    if (wallet.user._id.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to access this wallet");
    }
    return wallet;
});
exports.WalletService = {
    getMyWallet,
};
