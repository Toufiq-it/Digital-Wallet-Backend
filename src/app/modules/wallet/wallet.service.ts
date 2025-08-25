import AppError from "../../errorHelpers/AppError";
import { Wallet } from "./wallet.model";
import httpStatus from 'http-status-codes';

// get own Wallet
const getMyWallet = async (userId: string, role: string) =>{
  if (role === "ADMIN") {
    throw new AppError(httpStatus.FORBIDDEN, "Admins cannot use this endpoint, they have another endpoint to view all wallets");
  }

  const wallet = await Wallet.findOne({ user: userId }).populate("user", "name email role");
  if (!wallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

  if (wallet.user._id.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to access this wallet");
  }

  return wallet;
};

export const WalletService = {
    getMyWallet,
}