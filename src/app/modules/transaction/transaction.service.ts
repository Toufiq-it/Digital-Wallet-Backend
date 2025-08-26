import AppError from "../../errorHelpers/AppError";
import httpStatus from 'http-status-codes';
import { Transaction } from "./transaction.model";

const getMyTransactions = async (
  loginSlug: string,     
  paramSlug: string,     
  userId: string,        
  query: Record<string, string>
) => {
    
  // slug check
  if (loginSlug !== paramSlug) {
    throw new AppError(httpStatus.FORBIDDEN, "You can not see other user's transactions");
  }

  // 🔎 Pagination + sorting
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sort = query.sortBy || "-createdAt"; // newest first
  const skip = (page - 1) * limit;


  const filter = {
    $or: [{ fromUser: userId }, { toUser: userId }],
  };

  const transactions = await Transaction.find(filter)
    .populate("fromUser", "name phone slug")
    .populate("toUser", "name phone slug")
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

export const TransactionService = {
    getMyTransactions,
}
