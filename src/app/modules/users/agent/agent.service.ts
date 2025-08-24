// agent.service.ts
import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import { User } from "../user/user.model";
import AppError from "../../../errorHelpers/AppError";
import { Wallet } from "../../wallet/wallet.model";
import { Transaction } from "../../transaction/transaction.model";
import { TransactionStatus, TransactionType } from "../../transaction/transaction.interface";
import { JwtPayload } from "jsonwebtoken";

// Cash In
const cashIn = async (agentId: string, userId: string, amount: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verify agent
    const agent = await User.findById(agentId).session(session).populate("wallet", "balance status");

    if (!agent || agent.role !== "AGENT") {
      throw new AppError(httpStatus.FORBIDDEN, "Only agents can perform Cash-In");
    }
    if ((agent.wallet as JwtPayload).status === "SUSPENDED") {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent Wallet is Suspend, Not ready to Cash-In")
    }

    // Find user wallet
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (wallet.status === "BLOCKED") {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet is not active");
    }

    // Update balance
    wallet.balance += amount;
    await wallet.save({ session });

    // transaction
    await Transaction.create([{
      type: TransactionType.CASH_IN,
      amount,
      // fee,
      fromUser: agentId,
      toUser: userId,
      initiatedBy: agentId,
      status: TransactionStatus.COMPLETED,
      meta: { method: "Agent Cash-In" },
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return wallet;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// Cash Out
const cashOut = async (agentId: string, userId: string, amount: number) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verify agent
    const agent = await User.findById(agentId).session(session);
    if (!agent || agent.role !== "AGENT") {
      throw new AppError(httpStatus.FORBIDDEN, "Only agents can perform cash-out");
    }
    if ((agent.wallet as JwtPayload).status === "SUSPENDED") {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent Wallet is Suspend, Not ready to Cash-In")
    }

    // Find user wallet
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (wallet.status === "BLOCKED") {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet is not active");
    }

    // Fee (10%)
    const fee = Math.ceil(amount * 0.1);
    const debit = amount + fee;

    if (wallet.balance < debit) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    // Update balance
    wallet.balance -= debit;
    await wallet.save({ session });

    // Transaction
    await Transaction.create([{
      type: TransactionType.CASH_OUT,
      amount,
      fee,
      fromUser: userId,
      toUser: agentId,
      initiatedBy: userId,
      status: TransactionStatus.COMPLETED,
      meta: { method: "Agent Cash-Out" },
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return wallet;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// View My Transaction History
const agentTransactions = async (agentId: string, query: Record<string, string>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sort = query.sortBy || "createdAt";
  // const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const skip = (page - 1) * limit;

  const filter = {
    $or: [{ fromUser: agentId }, { toUser: agentId }],
  };

  const transactions = await Transaction.find(filter)
    .populate("fromUser", "name phone role") 
    .populate("toUser", "name phone role")
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

export const AgentService = {
  cashIn,
  cashOut,
  agentTransactions,
};
