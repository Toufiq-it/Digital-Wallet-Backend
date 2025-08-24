import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../ulits/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/users/user/user.model";
import httpStatus from 'http-status-codes';
import { IsActive } from "../modules/users/user/user.interface";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        // jwt token check
        if (!accessToken) {
            throw new AppError(httpStatus.FORBIDDEN, "No token received");
        }

        // const authHeader = req.headers.authorization;
        // if (!authHeader) {
        //     throw new AppError(httpStatus.FORBIDDEN, "No token received");
        // }

        // // Extract token from "Bearer <token>"
        // const accessToken = authHeader.startsWith("Bearer ")
        //     ? authHeader.split(" ")[1]
        //     : authHeader;


        // jwt token verified
        const verifiedToke = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;
        // console.log("Decoded token in middleware:", verifiedToke);


        // phone check
        const isUserExist = await User.findOne({ phone: verifiedToke.phone });

        // user validetion
        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User dose not Exist")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }

        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        }

        // user role check
        if (!authRoles.includes(verifiedToke.role)) {
            throw new AppError(httpStatus.BAD_REQUEST, "You are not permitted to view this route!!");
        }

        req.user = verifiedToke;
        // console.log("req user", req.user);
        
        next();

    } catch (error) {
        console.log("jwt error", error);
        next(error);
    }
}