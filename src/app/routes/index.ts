import { Router } from "express";
import { UserRoutes } from "../modules/users/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { AgentRoutes } from "../modules/users/agent/agent.route";
import { AdminRoutes } from "../modules/users/admin/admin.route";

export const router = Router();

const moduleRoutes = [
    {
        path : "/auth",
        route : AuthRoutes,
    },
    {
        path : "/admin",
        route : AdminRoutes,
    },
    {
        path : "/user",
        route : UserRoutes,
    },
    {
        path : "/agent",
        route : AgentRoutes,
    },
    {
        path : "/wallet",
        route : WalletRoutes,
    },
];

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route); 
})