import { z } from "zod";
import { WalletStatus } from "../../wallet/wallet.interface";

export const userStatusSchema = z.object({
    userId: z.string(),
    status: z.enum(Object.values(WalletStatus) as [string]),
    
});

export const agentStatusSchema = z.object({
    agentId: z.string(),
    status: z.enum(Object.values(WalletStatus) as [string]),
});
