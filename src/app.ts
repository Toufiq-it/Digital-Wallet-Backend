import express, { Request, Response } from "express";

const app = express();

// Root Route
app.get("/",(req: Request, res: Response)=>{
    res.status(200).json({
        message: "Welcome to Digital Wallet"
    });
});


export default app;
