/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { WalletService } from "./wallet.service";
import sendResponse from "../../ulits/sendResponse";
import { catchAsync } from "../../ulits/catchAsync";
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";

// Add money
const addMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  // console.log("req user",req.user);
  const decodeToken = req.user as JwtPayload
  const wallet = await WalletService.addMoney(req.body, decodeToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Money added successfully',
    data: wallet,
  });
});

// withdraw 
const withdraw = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodeToken = req.user as JwtPayload
  console.log(req.user);
  
  const wallet = await WalletService.withdraw(req.body, decodeToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Withdraw successfully',
    data: wallet,
  });
});

// send money
const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodeToken = req.user as JwtPayload
  const { receiverId, amount } = req.body;
  const wallet = await WalletService.sendMoney({ receiverId, amount }, decodeToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Send-Money successfully',
    data: wallet,
  });
});

const getMyTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const decodeToken = req.user as JwtPayload
  const userId = decodeToken.userId
  const query = req.query

  const transactions = await WalletService.getMyTransactions(userId, query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Transaction history",
    data: transactions,
  });
});

export const WalletController = {
  addMoney,
  withdraw,
  sendMoney,
  getMyTransactions,
};