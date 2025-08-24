import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import { agentStatusSchema, userStatusSchema } from "./admin.validation";


const router = Router();

router.get("/users", checkAuth(Role.ADMIN), AdminController.getAllUsers);
router.get("/agents", checkAuth(Role.ADMIN), AdminController.getAllAgents);
router.get("/wallets", checkAuth(Role.ADMIN), AdminController.getAllWallets);
router.get("/all-transactions", checkAuth(Role.ADMIN), AdminController.getAllTransactions);

router.patch(
  "/user-status",
  checkAuth(Role.ADMIN),
  validateRequest(userStatusSchema),
  AdminController.blockOrUnblockWallet
);

router.patch(
  "/agent-status",
  checkAuth(Role.ADMIN),
  validateRequest(agentStatusSchema),
  AdminController.approveOrSuspendAgent
);

export const AdminRoutes = router;