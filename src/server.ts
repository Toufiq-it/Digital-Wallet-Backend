/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedAdmin } from "./app/ulits/seedAdmin";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);

        console.log("Connected to Database !!!");

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening on port ${envVars.PORT}`);
        });
    } catch (error) {
        console.log(error);
    };

};

// ifi function
(async () => {
    await startServer();
    // admin
    await seedAdmin();
})()


// unhandled rejection error
process.on("unhandledRejection", (err) => {
    console.log("unhandled Rejection detected... server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Promise.reject(new Error("I forgot to catch this error"));


// uncaught rejection error
process.on("uncaughtException", (err) => {
    console.log("uncaught Exception detected... server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// throw new Error("i forgot to handle this local error");


// signal termination sigterm
process.on("SIGTERM", () => {
    console.log("SIGTERM signal recevied... server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on("SIGINT", () => {
    console.log("SIGINT signal recevied... server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});