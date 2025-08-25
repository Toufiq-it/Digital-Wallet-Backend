"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../users/user/user.interface");
const wallet_controller_1 = require("./wallet.controller");
const router = (0, express_1.Router)();
// get own wallet
router.get("/my-wallet", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT, user_interface_1.Role.USER), wallet_controller_1.WalletController.getMyWallet);
exports.WalletRoutes = router;
