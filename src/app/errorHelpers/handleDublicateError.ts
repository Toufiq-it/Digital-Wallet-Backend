/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";


export const handleDublicateError = (err: any): TGenericErrorResponse => {
    const matchArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchArray[1]} already exist !!`
    }
};