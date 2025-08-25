"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/users/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const agent_route_1 = require("../modules/users/agent/agent.route");
const admin_route_1 = require("../modules/users/admin/admin.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes,
    },
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/agent",
        route: agent_route_1.AgentRoutes,
    },
    {
        path: "/wallet",
        route: wallet_route_1.WalletRoutes,
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
