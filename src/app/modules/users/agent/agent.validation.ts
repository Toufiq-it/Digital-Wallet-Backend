import { z } from "zod";

// export enum AgentWalletStatus {
    
// };

export const cashInOutSchema = z.object({
  userId: z.string(),
  amount: z.number().positive({ message: "Amount must be Postive Number" }),
});
