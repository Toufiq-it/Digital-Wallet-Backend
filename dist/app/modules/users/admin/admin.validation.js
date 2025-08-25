"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentStatusSchema = exports.userStatusSchema = void 0;
const zod_1 = require("zod");
const wallet_interface_1 = require("../../wallet/wallet.interface");
exports.userStatusSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    status: zod_1.z.enum(Object.values(wallet_interface_1.WalletStatus)),
});
exports.agentStatusSchema = zod_1.z.object({
    agentId: zod_1.z.string(),
    status: zod_1.z.enum(Object.values(wallet_interface_1.WalletStatus)),
});
