import express, { Request, Response } from "express";
import cors from 'cors';
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import expressSession from 'express-session';
import { envVars } from "./app/config/env";

const app = express();

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api", router)

// Root Route
app.get("/",(req: Request, res: Response)=>{
    res.status(200).json({
        message: "Welcome to Digital Wallet"
    });
});

// Global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);


export default app;
