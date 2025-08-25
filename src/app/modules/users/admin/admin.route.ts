import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/users", checkAuth(Role.ADMIN), AdminController.getAllUsers);
router.get("/agents", checkAuth(Role.ADMIN), AdminController.getAllAgents);
router.get("/wallets", checkAuth(Role.ADMIN), AdminController.getAllWallets);
router.get("/all-transactions", checkAuth(Role.ADMIN), AdminController.getAllTransactions);


export const AdminRoutes = router;