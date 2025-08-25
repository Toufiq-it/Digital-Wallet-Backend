/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../ulits/catchAsync";
import { AgentService } from "./agent.service";
import sendResponse from "../../../ulits/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from 'http-status-codes';
import AppError from "../../../errorHelpers/AppError";


const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //   const agentId = req.user.userId;
    const decodeToken = req.user as JwtPayload
    const agentId = decodeToken.userId

    const { userId, amount } = req.body;
    const wallet = await AgentService.cashIn(agentId, userId, amount);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Cash-in successful",
        data: wallet,
    });
});

const cashOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const agentId = req.user.userId;
    const decodeToken = req.user as JwtPayload
    const agentId = decodeToken.userId

    const { userId, amount } = req.body;
    const wallet = await AgentService.cashOut(agentId, userId, amount);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Cash-out successful",
        data: wallet,
    });
});


const agentTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodeToken = req.user as JwtPayload
  const agentId = decodeToken.userId
  const query = req.query

  const transactions = await AgentService.agentTransactions(agentId, query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Transaction history",
    data: transactions,
  });
});

// agent wallet update
const suspendedWallet = catchAsync(async (req: Request, res: Response) => {
    const { agentId, status } = req.body;

    if (status === "ACTIVE" || status === "BLOCKED") {
        throw new AppError(httpStatus.BAD_REQUEST, "The Agent will only be APPROVED or SUSPENDED")
    }

    const agent = await AgentService.suspendedWallet(agentId, status);
    sendResponse(res, { 
        statusCode: 200, 
        success: true, 
        message: "Agent Wallet status updated", 
        data: agent 
    });
});

export const AgentController = {
    cashIn,
    cashOut,
    agentTransactions,
    suspendedWallet,
};