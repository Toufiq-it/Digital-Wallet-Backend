/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../ulits/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../ulits/sendResponse";
import httpStatus from 'http-status-codes';
import { WalletService } from "./wallet.service";

// get Wallet
const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;   // comes from auth middleware
    const userId = decodeToken.userId
    const role = decodeToken.role;
    
    const wallet = await WalletService.getMyWallet(userId, role);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Wallet Retrieved Successfully",
        data: wallet,
    });
});

export const WalletController = {
    getMyWallet
}