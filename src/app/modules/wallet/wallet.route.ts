import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user/user.interface";
import { WalletController } from "./wallet.controller";

const router = Router();

// get own wallet
router.get("/:slug",
    checkAuth(Role.AGENT, Role.USER),
    WalletController.getMyWallet
);

export const WalletRoutes = router;