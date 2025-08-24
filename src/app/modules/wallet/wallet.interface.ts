import { Types } from "mongoose"


export enum WalletStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
    APPROVED = "APPROVED",
    SUSPENDED = "SUSPENDED"
};

// export enum AgentWalletStatus {
// };


export interface IWallet {
    user: Types.ObjectId,
    balance: number,
    status: WalletStatus,
}