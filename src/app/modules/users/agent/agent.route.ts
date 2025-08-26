import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { cashInOutSchema } from "./agent.validation";
import { AgentController } from "./agent.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { agentStatusSchema } from "../admin/admin.validation";


const router = Router();

router.post(
  "/cash-in",
  checkAuth(Role.AGENT),
  validateRequest(cashInOutSchema),
  AgentController.cashIn
);

router.post(
  "/cash-out",
  checkAuth(Role.AGENT),
  validateRequest(cashInOutSchema),
  AgentController.cashOut
);

// agent wallet
router.patch(
  "/status",
  checkAuth(Role.AGENT, Role.ADMIN),
  validateRequest(agentStatusSchema),
  AgentController.suspendedWallet
);


export const AgentRoutes = router;