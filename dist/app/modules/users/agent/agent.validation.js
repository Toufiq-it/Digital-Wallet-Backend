"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashInOutSchema = void 0;
const zod_1 = require("zod");
// export enum AgentWalletStatus {
// };
exports.cashInOutSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    amount: zod_1.z.number().positive({ message: "Amount must be Postive Number" }),
});
