import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { addWithdrewMoneyZod, sendMoneyZod } from "../../wallet/wallet.validation";
import { userStatusSchema } from "../admin/admin.validation";

const router = Router();

// User Registertion
router.post("/register", 
    validateRequest(createUserZodSchema), 
    UserController.createUser
);

// ---------------user Wallet Route-----------
router.post("/add-money", 
    checkAuth(Role.USER),
    validateRequest(addWithdrewMoneyZod), 
    UserController.addMoney);

router.post("/withdraw", 
    checkAuth(Role.USER),
    validateRequest(addWithdrewMoneyZod), 
    UserController.withdraw);

router.post("/send-money", 
    checkAuth(Role.USER),
    validateRequest(sendMoneyZod), 
    UserController.sendMoney);

router.get("/my-transactions", 
    checkAuth(Role.USER), 
    UserController.getMyTransactions);

router.patch(
  "/status",
  checkAuth(Role.USER, Role.ADMIN),
  validateRequest(userStatusSchema),
  UserController.blockWallet
);

// user Update
router.patch("/:id", 
    validateRequest(updateUserZodSchema), 
    checkAuth(...Object.values(Role)), 
    UserController.updateUser
);

export const UserRoutes = router;