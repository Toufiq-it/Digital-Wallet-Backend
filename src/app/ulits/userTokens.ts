import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/users/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/users/user/user.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from 'http-status-codes';


export const createUsertoken = (user: Partial<IUser>) => {
    const jwtPayload = {
            userId: user._id,
            phone: user.phone,
            role: user.role,
        }
    
        const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
        
        // refresh token
        const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

        return {
            accessToken,
            refreshToken,
        }
};

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string)=>{

    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    //email check
    const isUserExist = await User.findOne({ phone: verifiedRefreshToken.phone });

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

    // jwt token
    const jwtPayload = {
        userId: isUserExist._id,
        phone: isUserExist.phone,
        role: isUserExist.role,
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
    return accessToken;

}