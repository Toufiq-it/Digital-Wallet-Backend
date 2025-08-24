import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { addWithdrewMoneyZod, sendMoneyZod } from "./wallet.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../users/user/user.interface";


const router = Router();

router.post("/add-money", 
    checkAuth(Role.USER),
    validateRequest(addWithdrewMoneyZod), 
    WalletController.addMoney);

router.post("/withdraw", 
    checkAuth(Role.USER),
    validateRequest(addWithdrewMoneyZod), 
    WalletController.withdraw);

router.post("/send-money", 
    checkAuth(Role.USER),
    validateRequest(sendMoneyZod), 
    WalletController.sendMoney);

router.get("/my-transactions", 
    checkAuth(Role.USER), 
    WalletController.getMyTransactions);



export const WalletRoutes = router;