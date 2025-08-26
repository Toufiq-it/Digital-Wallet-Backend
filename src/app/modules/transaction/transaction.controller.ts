/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../ulits/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../ulits/sendResponse";
import httpStatus from 'http-status-codes';
import { TransactionService } from "./transaction.service";

const getMyTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedTokan = req.user as JwtPayload
    const loginSlug = decodedTokan.slug 
    const userId = decodedTokan.userId
    const slug  = req.params.slug
    const query = req.query

    const Transactions = await TransactionService.getMyTransactions(loginSlug, slug, userId, query as Record<string, string>);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Transactions Retrieved Successfully",
      data: Transactions,
    });
});

export const TransactionController = {
  getMyTransactions,
}
