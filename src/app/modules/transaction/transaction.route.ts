import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user/user.interface";
import { TransactionController } from "./transaction.controller";


const router = Router();

router.get("/:slug", 
    checkAuth(...Object.values(Role)), 
    TransactionController.getMyTransactions
);

export const TransactionRoutes = router;