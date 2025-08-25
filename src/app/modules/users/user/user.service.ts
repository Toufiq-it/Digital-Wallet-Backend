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
import { Transaction } from "../../transaction/transaction.model";
import { TransactionStatus, TransactionType } from "../../transaction/transaction.interface";



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
};

// get single user
const getSingleUser = async (slug: string) =>{
  const user = await User.findOne({slug});
  if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found.");
    }
  return {
    data: user,
  }
};

// -------------------User WALLET Service---------------------

// Add Money
const addMoney = async (payload: { amount: number }, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const amount = Number(payload?.amount);
    if (!amount || amount <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
    }

    // wellet validation
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found");
    }
    if (wallet.status === "BLOCKED") {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet is not active");
    }

    wallet.balance += amount;
    await wallet.save({ session });

    await Transaction.create(
      [
        {
          type: TransactionType.ADD_MONEY,
          amount,
          fromUser: null,
          toUser: wallet.user,
          initiatedBy: wallet.user,
          status: TransactionStatus.COMPLETED,
          meta: { source: "self-topup" },
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return wallet;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// withdraw
const withdraw = async (payload: { amount: number }, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const amount = Number(payload?.amount);
    if (!amount || amount <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Please, Provide a postive Number");
    }

    // wellet validation
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    // console.log(wallet);


    if (!wallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found");
    }

    if (wallet.status !== "ACTIVE") {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet is not active");
    }

    // Fee (10%)
    const fee = Math.ceil(amount * 0.10);
    const debit = amount + fee;

    if (wallet.balance < debit) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    wallet.balance -= debit;
    await wallet.save({ session });

    await Transaction.create(
      [{
        type: TransactionType.WITHDRAW,
        amount,
        fee,
        fromUser: wallet.user,
        toUser: null,
        initiatedBy: wallet.user,
        status: TransactionStatus.COMPLETED,
        meta: { source: "self-withdrawal" },
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return wallet;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Send money
const sendMoney = async (payload: { receiverId: string; amount: number }, userId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { receiverId, amount: rawAmount } = payload;
    const amount = Number(rawAmount);

    if (!receiverId) throw new AppError(httpStatus.BAD_REQUEST, "receiverId is required");
    if (!amount || amount <= 0) throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
    if (receiverId === userId) throw new AppError(httpStatus.BAD_REQUEST, "Cannot send money to self");

    // fetch wallets
    const senderWallet = await Wallet.findOne({ user: userId }).session(session);
    const receiverWallet = await Wallet.findOne({ user: receiverId }).session(session);

    if (!senderWallet) throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
    if (!receiverWallet) throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
    if (senderWallet.status !== "ACTIVE") throw new AppError(httpStatus.BAD_REQUEST, "Sender wallet blocked");
    if (receiverWallet.status !== "ACTIVE") throw new AppError(httpStatus.BAD_REQUEST, "Receiver wallet blocked");

    // Fee (5%)
    const fee = Math.ceil(amount * 0.05);
    const debit = amount + fee;

    if (senderWallet.balance < debit) throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

    // update balances
    senderWallet.balance -= debit;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    // create single transaction record (sender-side only)
    await Transaction.create(
      [{
        type: TransactionType.SEND_MONEY,
        amount,
        fee,
        fromUser: senderWallet.user,
        toUser: receiverWallet.user,
        initiatedBy: senderWallet.user,
        status: TransactionStatus.COMPLETED,
        meta: { method: "Send Money" }
      }],
      { session }
    );

    await session.commitTransaction();
    return { senderWallet, receiverWallet, fee };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// View My Transaction History
const getMyTransactions = async (userId: string, query: Record<string, string>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sort = query.sortBy || "createdAt";
  // const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const skip = (page - 1) * limit;

  const filter = {
    $or: [{ fromUser: userId }, { toUser: userId }],
  };

  const transactions = await Transaction.find(filter)
    .populate("fromUser", "name phone")
    .populate("toUser", "name phone")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(filter);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: transactions,
  };
};


// user wallet status update => admin
const blockWallet = async (userId: string, status: WalletStatus) => {
    const user = await User.findById(userId).populate("wallet", "_id balance status");
    if (!user || user.role !== "USER") {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    }

    const updateUser = user.wallet as JwtPayload;

    updateUser.status = status;
    await updateUser.save();
    return user;
};


export const UserService = {
  createUser,
  updateUser,
  getSingleUser,
  // Wallet
  addMoney,
  withdraw,
  sendMoney,
  getMyTransactions,
  blockWallet,
};