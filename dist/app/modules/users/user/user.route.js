"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = require("../../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const checkAuth_1 = require("../../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const wallet_validation_1 = require("../../wallet/wallet.validation");
const admin_validation_1 = require("../admin/admin.validation");
const router = (0, express_1.Router)();
// User Registertion
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserController.createUser);
// user Update
router.patch("/:id", (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.updateUser);
// get user
router.get("/:slug", user_controller_1.UserController.getSingleUser);
// ---------------user Wallet Route-----------
router.post("/add-money", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.addWithdrewMoneyZod), user_controller_1.UserController.addMoney);
router.post("/withdraw", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.addWithdrewMoneyZod), user_controller_1.UserController.withdraw);
router.post("/send-money", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.sendMoneyZod), user_controller_1.UserController.sendMoney);
router.get("/my-transactions", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), user_controller_1.UserController.getMyTransactions);
router.patch("/status", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(admin_validation_1.userStatusSchema), user_controller_1.UserController.blockWallet);
exports.UserRoutes = router;
