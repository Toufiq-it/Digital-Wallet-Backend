"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../../middlewares/validateRequest");
const agent_validation_1 = require("./agent.validation");
const agent_controller_1 = require("./agent.controller");
const checkAuth_1 = require("../../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const admin_validation_1 = require("../admin/admin.validation");
const router = (0, express_1.Router)();
router.post("/cash-in", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(agent_validation_1.cashInOutSchema), agent_controller_1.AgentController.cashIn);
router.post("/cash-out", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(agent_validation_1.cashInOutSchema), agent_controller_1.AgentController.cashOut);
router.get("/my-transactions", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), agent_controller_1.AgentController.agentTransactions);
// agent wallet
router.patch("/status", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(admin_validation_1.agentStatusSchema), agent_controller_1.AgentController.suspendedWallet);
exports.AgentRoutes = router;
