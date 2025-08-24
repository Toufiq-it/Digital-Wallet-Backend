import AppError from "../../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../../wallet/wallet.model";
import { WalletStatus } from "../../wallet/wallet.interface";
import mongoose from "mongoose";

// create user
const createUser = async (payload: Partial<IUser>) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, ...rest } = payload;

    // check existing user
    const isUserExist = await User.findOne({ email }).session(session);
    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is Already Exist")
    }

    // hash password
    const hashPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider: IAuthProvider = { provider: "credential", providerId: email as string }

    // user create
    const user = await User.create([{  // <-- array + {session}
      email,
      password: hashPassword,
      auth: [authProvider],
      ...rest,
    }], { session });

    // wallet create
    const wallet = await Wallet.create([{
      user: user[0]._id,
      balance: user[0].role === "ADMIN" ? 0 : 50,
      status: user[0].role === "USER" || user[0].role === "ADMIN" ?
        WalletStatus.ACTIVE : WalletStatus.APPROVED,
    }], { session });

    // update user with wallet reference
    const updateUser = await User.findByIdAndUpdate(
      user[0]._id,
      { wallet: wallet[0]._id },
      { new: true, runValidators: true, session }
    ).populate("wallet", "_id balance status");

    await session.commitTransaction();
    session.endSession();
    return updateUser;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// const createUser = async (payload: Partial<IUser>) => {
//   const session = await mongoose.startSession();
//   try {
//     let createdUserId: mongoose.Types.ObjectId;

//     await session.withTransaction(async () => {
//       const { email, password, ...rest } = payload;

//       const exists = await User.findOne({ email }).session(session);
//       if (exists) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
//       }
//       const hashPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));
//       const authProvider : IAuthProvider = { provider: "credential", providerId: email as string };

//       // 1) Create user
//       const [userDoc] = await User.create([{
//         email,
//         password: hashPassword,
//         auth: [authProvider],
//         ...rest,
//       }], { session });

//       // 2) Create wallet
//       const [walletDoc] = await Wallet.create([{
//         user: userDoc._id,
//         balance: 50,
//         status: userDoc.role === "AGENT" ? WalletStatus.APPROVED : WalletStatus.ACTIVE,
//       }], { session });

//       // 3) Link user.wallet
//       userDoc.wallet = walletDoc._id;
//       await userDoc.save({ session });

//     createdUserId = userDoc._id;
//     });

//     // outside the transaction, fetch populated user (auto-populate hook will also work)
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     const fullUser = await User.findById(createdUserId!).populate("wallet", "_id balance status");
//     return fullUser;
//   } finally {
//     session.endSession(); // no abort/commit here; withTransaction handled it
//   }
// };


// update user
const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

  const ifUserIdExist = await User.findById(userId);

  if (!ifUserIdExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  /**
   * phone - can not update
   * name, email, password, address
   * password re hashing
   * only admin -> role, isDeleted
   * 
   * promoting Admin -> Admin
   */

  // Role update
  if (payload.role) {
    // user ba agent hole ei error
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // user, agent jodi isActive, isDeleted, isVarified update korte cay
  if (payload.isActive || payload.isDeleted || payload.isVarified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // password hashing
  if (payload.password) {
    payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
  return newUpdateUser;
}

// get All users
const getAllUsers = async () => {
  const users = await User.find({});

  const totalUser = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUser,
    }
  };
}


export const UserService = {
  createUser,
  updateUser,
  getAllUsers,
};