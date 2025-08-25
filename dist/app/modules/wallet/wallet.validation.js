"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletZodSchema = exports.createWalletZodSchema = exports.sendMoneyZod = exports.addWithdrewMoneyZod = void 0;
const zod_1 = __importDefault(require("zod"));
const wallet_interface_1 = require("./wallet.interface");
exports.addWithdrewMoneyZod = zod_1.default.object({
    amount: zod_1.default.number().min(0).int().positive({ message: "Balance must be positive Number" })
});
exports.sendMoneyZod = zod_1.default.object({
    receiverId: zod_1.default.string(),
    amount: zod_1.default.number().min(0).int().positive({ message: "Balance must be positive Number" })
});
exports.createWalletZodSchema = zod_1.default.object({
    user: zod_1.default.string(),
    balance: zod_1.default.number().min(0).int().positive({ message: "Balance must be positive Number" }),
    // status: z.enum(Object.values(WalletStatus) as [string]),
});
exports.updateWalletZodSchema = zod_1.default.object({
    status: zod_1.default.enum(Object.values(wallet_interface_1.WalletStatus)),
});
