import z from "zod";
import { IsActive, Role } from "./user.interface";


export const createUserZodSchema = z.object({
    name: z
        .string({ error: "Name must be string" })
        .min(3, { message: "Name must be at least 3 characters long." })
        .max(20, { message: "Name cannot exceed 20 characters." }),
    phone: z
        .string({ error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        }),
    role: z
    .enum(Object.values(Role) as [string]),
    // wallet: z
    //     .number({ error: "Wallet must be a number"})
    //     .int({message: "wallet must be an integer"})
    //     .min(0, {message: "Wallet must be a positive number"}),
    email: z
        .string({ error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." })
        .optional(),
    password: z
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),
    address: z
        .string({ error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    // Wallet: z.number().optional(),
});

export const updateUserZodSchema = z.object({
    name: z
        .string({ error: "Name must be string" })
        .min(3, { message: "Name must be at least 3 characters long." })
        .max(20, { message: "Name cannot exceed 20 characters." })
        .optional(),
    password: z
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }).optional(),
    email: z
        .string({ error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." })
        .optional(),
    role: z
        .enum(Object.values(Role) as [string])
        .optional(),
    isActive: z
        .enum(Object.values(IsActive) as [string])
        .optional(),
    isDeleted: z
        .boolean({ error: "isDeleted must be true or false" })
        .optional(),
    isVerified: z
        .boolean({ error: "isVerified must be true or false" })
        .optional(),
    address: z
        .string({ error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional()
})