import { Request, Response } from "express";
import { catchAsync } from "../../../ulits/catchAsync";
import sendResponse from "../../../ulits/sendResponse";
import { AdminService } from "./admin.service";
import AppError from "../../../errorHelpers/AppError";
import httpStatus from 'http-status-codes';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await AdminService.getAllUsers();
    sendResponse(res, { 
        statusCode: 200, 
        success: true, 
        message: "Users retrieved Successfully", 
        data: users
     });
});

const getAllAgents = catchAsync(async (req: Request, res: Response) => {
    const agents = await AdminService.getAllAgents();
    sendResponse(res, { 
        statusCode: 200, 
        success: true, 
        message: "Agents retrieved Successfully", 
        data: agents
     });
});

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
    const wallets = await AdminService.getAllWallets();
    sendResponse(res, { 
        statusCode: 200, 
        success: true, 
        message: "Wallets retrieved Successfully", 
        data: wallets
     });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {

    const query = req.query

    const transactions = await AdminService.getAllTransactions(query as Record<string, string>);
    sendResponse(res, { 
        statusCode: 200, 
        success: true, 
        message: "All Transactions retrieved Successfully", 
        data: transactions 
    });
});

const blockOrUnblockWallet = catchAsync(async (req: Request, res: Response) => {
    const { userId, status } = req.body;

    if (status === "APPROVED" || status === "SUSPENDED") {
        throw new AppError(httpStatus.BAD_REQUEST, "The User will only be ACTIVE or BLOCKED")
    }
    
    const user = await AdminService.blockOrUnblockWallet(userId, status);
    sendResponse(res, { 
        statusCode: 200, 
        success: true, 
        message: "User Wallet status updated", 
        data: user 
    });
});

const approveOrSuspendAgent = catchAsync(async (req: Request, res: Response) => {
    const { agentId, status } = req.body;

    if (status === "ACTIVE" || status === "BLOCKED") {
        throw new AppError(httpStatus.BAD_REQUEST, "The Agent will only be APPROVED or SUSPENDED")
    }

    const agent = await AdminService.approveOrSuspendAgent(agentId, status);
    sendResponse(res, { 
        statusCode: 200, 
        success: true, 
        message: "Agent Wallet status updated", 
        data: agent 
    });
});

export const AdminController = {
    getAllUsers,
    getAllAgents,
    getAllWallets,
    getAllTransactions,
    blockOrUnblockWallet,
    approveOrSuspendAgent,
};
