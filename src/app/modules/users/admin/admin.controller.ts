import { Request, Response } from "express";
import { catchAsync } from "../../../ulits/catchAsync";
import sendResponse from "../../../ulits/sendResponse";
import { AdminService } from "./admin.service";

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


export const AdminController = {
    getAllUsers,
    getAllAgents,
    getAllWallets,
    getAllTransactions,
};
