"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = exports.walletSchema = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
exports.walletSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    balance: { type: Number, default: 50, min: 0 },
    status: {
        type: String,
        enum: Object.values(wallet_interface_1.WalletStatus),
        default: wallet_interface_1.WalletStatus.ACTIVE
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Wallet = (0, mongoose_1.model)('Wallet', exports.walletSchema);
