/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../ulits/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../ulits/sendResponse";
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { Wallet } from "./wallet.model";

// get Wallet
const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
    const decodedTokan = req.user as JwtPayload
    const loginSlug = decodedTokan.slug   // from token
    const { slug } = req.params;        // slug from request URL

    // check slug
    if (loginSlug !== slug) {
      throw new AppError(httpStatus.FORBIDDEN, "You can not see other user's wallet");
    }

    const wallet = await Wallet.findOne({ user: req.user.userId })
      .populate("user", "name phone email role");

    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Wallet Retrieved Successfully",
        data: wallet,
    });
  } catch (error) {
    next(error);
  }
});

export const WalletController = {
    getMyWallet
}