import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { cashInOutSchema } from "./agent.validation";
import { AgentController } from "./agent.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


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

router.get(
  "/my-transactions",
  checkAuth(Role.AGENT),
  AgentController.agentTransactions
);



export const AgentRoutes = router;