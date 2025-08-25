import { User } from "../user/user.model";
import { Wallet } from "../../wallet/wallet.model";
import { Transaction } from "../../transaction/transaction.model";


const getAllUsers = async () => {
    const users = await User.find({role: "USER"}).populate("wallet", "_id balance status");
    const totalUsers = await User.countDocuments({role: "USER"});

    return{
        meta:{
            total: totalUsers
        },
        users: users
    }
};

const getAllAgents = async () => {
    const agent = await User.find({ role: "AGENT" }).populate("wallet", "_id balance status");
    const totalAgent = await User.countDocuments({role: "AGENT"});

    return{
        meta:{
            total: totalAgent
        },
        agents: agent
    }
};

const getAllWallets = async () => {
    const wallet = await Wallet.find().populate("user", "name phone role email");
    const total = await Wallet.countDocuments();

    return {
        meta:{
            total: total,
        },
        Wallets : wallet,
    }
};

const getAllTransactions = async (query: Record<string, string>) => {
    const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sort = query.sortBy || "createdAt";
  // const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const skip = (page - 1) * limit;

//   const filter = {
//     $or: [{ fromUser: userId }, { toUser: userId }],
//   };

  const transactions = await Transaction.find()
    .populate("fromUser", "name phone role") 
    .populate("toUser", "name phone role")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments();

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

export const AdminService = {
    getAllUsers,
    getAllAgents,
    getAllWallets,
    getAllTransactions,
};
