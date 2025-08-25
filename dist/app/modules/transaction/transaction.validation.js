"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const transaction_interface_1 = require("./transaction.interface");
exports.createTransactionValidation = zod_1.default.object({
    type: zod_1.default.enum(Object.values(transaction_interface_1.TransactionType)),
    amount: zod_1.default
        .number({ error: "Amount is required" })
        .positive("Amount must be Positive Number"),
    fee: zod_1.default.number().min(0).default(0),
    status: zod_1.default.enum(Object.values(transaction_interface_1.TransactionStatus)).default(transaction_interface_1.TransactionStatus.COMPLETED),
});
