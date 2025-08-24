import AppError from "../../errorHelpers/AppError";
import { Wallet } from "./wallet.model";
import httpStatus from 'http-status-codes';
import { Transaction } from "../transaction/transaction.model";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";
import mongoose from "mongoose";


// const addMoney = async (userId: string, amount: number) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         // Find the wallet
//         const wallet = await Wallet.findOne({ user: userId });
//         if (!wallet) {
//             throw new AppError(400, "Wallet not found for this user");
//         }

//         // Update balance
//         wallet.balance += amount;

//         // Save wallet
//         await wallet.save();

//         // Record transaction
//         await Transaction.create({
//             user: userId,
//             type: TransactionType.ADD_MONEY,
//             amount,
//             status: TransactionStatus.COMPLETED
//         });

//         await session.commitTransaction();
//         session.endSession();

//         return wallet;
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         throw error;
//     }
// }


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
    if (!amount || amount <= 0){
      throw new AppError(httpStatus.BAD_REQUEST, "Please, Provide a postive Number");
    } 

    // wellet validation
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    console.log(wallet);
    

    if (!wallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found");
    }

    if (wallet.status !== "ACTIVE") {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet is not active");
    }
    
    // Fee (10%)
    const fee = Math.ceil(amount * 0.10);
    const debit = amount + fee;

    if (wallet.balance < debit){
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
const sendMoney = async (payload: { receiverId: string; amount: number },userId: string) => {
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
  } catch (e) {
    await session.abortTransaction();
    throw e;
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


export const WalletService = {
    addMoney,
    withdraw,
    sendMoney,
    getMyTransactions,
}