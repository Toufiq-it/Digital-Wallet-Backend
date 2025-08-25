"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const transactionSchema = new mongoose_1.Schema({
    type: { type: String, enum: Object.values(transaction_interface_1.TransactionType), required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    fromUser: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    toUser: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    initiatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: Object.values(transaction_interface_1.TransactionStatus), default: transaction_interface_1.TransactionStatus.COMPLETED },
    meta: { type: mongoose_1.Schema.Types.Mixed },
}, {
    timestamps: true,
    versionKey: false
});
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
