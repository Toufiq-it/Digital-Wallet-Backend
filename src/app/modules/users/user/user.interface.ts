import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT"
}

export interface IAuthProvider {
    provider: "credential" | "google",
    providerId: string,
};

export enum IsActive {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    slug: string,
    phone: string,
    email?: string,
    password?: string,
    picture?: string,
    address?: string,
    isDeleted?: string,
    isActive?: IsActive,
    isVarified?: boolean,
    role: Role,
    auth: IAuthProvider[],
};