import { Response } from "express";

export interface AuthTokens {
    accessToken?: string,
    refreshToken?: string,
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            // frontend e cookies ta set korbe
            httpOnly: true,
            secure: false,
        });
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
        })
    }
};