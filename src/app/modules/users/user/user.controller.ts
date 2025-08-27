/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../ulits/catchAsync";
import sendResponse from "../../../ulits/sendResponse";
import httpStatus from 'http-status-codes';
import { UserService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../../errorHelpers/AppError";


// -------------------User Controller---------------------

// create user
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    });
});

// get single user
const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;

    const decodeToken = req.user as JwtPayload
    const loginSlug = decodeToken.slug
    
//     console.log("loginSlug from token:", loginSlug);
// console.log("slug from params:", slug);

    const user = await UserService.getSingleUser(slug, loginSlug);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Retrived Successfully",
        data: user,
    });
});

// user update
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;

    const verifiedToken = req.user;

    const user = await UserService.updateUser(userId, payload, verifiedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
});

// ---------------------User WALLET Controller-------------------

// Add money
const addMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // console.log("req user",req.user);
    const decodeToken = req.user as JwtPayload
    const wallet = await UserService.addMoney(req.body, decodeToken.userId);

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
    const wallet = await UserService.withdraw(req.body, decodeToken.userId);

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
    const wallet = await UserService.sendMoney({ receiverId, amount }, decodeToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Send-Money successfully',
        data: wallet,
    });
});

// user wallet status update
const blockWallet = catchAsync(async (req: Request, res: Response) => {
    const { userId, status } = req.body;

    if (status === "APPROVED" || status === "SUSPENDED") {
        throw new AppError(httpStatus.BAD_REQUEST, "The User will only be ACTIVE or BLOCKED")
    }

    const user = await UserService.blockWallet(userId, status);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User Wallet status updated",
        data: user
    });
});



export const UserController = {
    createUser,
    getSingleUser,
    updateUser,
    // user Wallet
    addMoney,
    withdraw,
    sendMoney,
    blockWallet,
};