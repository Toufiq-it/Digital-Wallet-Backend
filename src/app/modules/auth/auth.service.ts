/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../users/user/user.interface";
import { User } from "../users/user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUsertoken } from "../../ulits/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

// custom login
const credentialsLogin = async (payload: Partial<IUser>) => {
    const { phone, password } = payload;

    //email check
    const isUserExist = await User.findOne({ phone });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Phone Number dose not Exist")
    }

    // password check
    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string);

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    };

    // jwt token
    const userTokens = createUsertoken(isUserExist);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest} = isUserExist.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
    };
};


// access token
const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken : newAccessToken,
    };
};

// reset password
const resetPassword = async (oldPassword: string, newPassword: string, decodedTokan: JwtPayload) => {

    const user = await User.findById(decodedTokan.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password dose not match");
    }

    // new password hashed and set new password
    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

    user!.save();
};

// user -> login -> token(user identity means _id, email, role etc) -> booking / payment / payment cancel -> token ->

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword,
}