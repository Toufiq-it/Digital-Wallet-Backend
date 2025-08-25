"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const AppError_1 = __importDefault(require("../../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../../config/env");
const wallet_model_1 = require("../../wallet/wallet.model");
const wallet_interface_1 = require("../../wallet/wallet.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_model_1 = require("../../transaction/transaction.model");
const transaction_interface_1 = require("../../transaction/transaction.interface");
// create user
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
        // check existing user
        const isUserExist = yield user_model_1.User.findOne({ email }).session(session);
        if (isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is Already Exist");
        }
        // hash password
        const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const authProvider = { provider: "credential", providerId: email };
        // user create
        const user = yield user_model_1.User.create([Object.assign({ // <-- array + {session}
                email, password: hashPassword, auth: [authProvider] }, rest)], { session });
        // wallet create
        const wallet = yield wallet_model_1.Wallet.create([{
                user: user[0]._id,
                balance: user[0].role === "ADMIN" ? 0 : 50,
                status: user[0].role === "USER" || user[0].role === "ADMIN" ?
                    wallet_interface_1.WalletStatus.ACTIVE : wallet_interface_1.WalletStatus.APPROVED,
            }], { session });
        // update user with wallet reference
        const updateUser = yield user_model_1.User.findByIdAndUpdate(user[0]._id, { wallet: wallet[0]._id }, { new: true, runValidators: true, session }).populate("wallet", "_id balance status");
        yield session.commitTransaction();
        session.endSession();
        return updateUser;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
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
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserIdExist = yield user_model_1.User.findById(userId);
    if (!ifUserIdExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
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
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    // user, agent jodi isActive, isDeleted, isVarified update korte cay
    if (payload.isActive || payload.isDeleted || payload.isVarified) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    // password hashing
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdateUser;
});
// get single user
const getSingleUser = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ slug });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found.");
    }
    return {
        data: user,
    };
});
// -------------------User WALLET Service---------------------
// Add Money
const addMoney = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const amount = Number(payload === null || payload === void 0 ? void 0 : payload.amount);
        if (!amount || amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
        }
        // wellet validation
        const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        if (!wallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet not found");
        }
        if (wallet.status === "BLOCKED") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is not active");
        }
        wallet.balance += amount;
        yield wallet.save({ session });
        yield transaction_model_1.Transaction.create([
            {
                type: transaction_interface_1.TransactionType.ADD_MONEY,
                amount,
                fromUser: null,
                toUser: wallet.user,
                initiatedBy: wallet.user,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
                meta: { source: "self-topup" },
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return wallet;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// withdraw
const withdraw = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const amount = Number(payload === null || payload === void 0 ? void 0 : payload.amount);
        if (!amount || amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please, Provide a postive Number");
        }
        // wellet validation
        const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        // console.log(wallet);
        if (!wallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet not found");
        }
        if (wallet.status !== "ACTIVE") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is not active");
        }
        // Fee (10%)
        const fee = Math.ceil(amount * 0.10);
        const debit = amount + fee;
        if (wallet.balance < debit) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
        }
        wallet.balance -= debit;
        yield wallet.save({ session });
        yield transaction_model_1.Transaction.create([{
                type: transaction_interface_1.TransactionType.WITHDRAW,
                amount,
                fee,
                fromUser: wallet.user,
                toUser: null,
                initiatedBy: wallet.user,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
                meta: { source: "self-withdrawal" },
            }], { session });
        yield session.commitTransaction();
        session.endSession();
        return wallet;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Send money
const sendMoney = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { receiverId, amount: rawAmount } = payload;
        const amount = Number(rawAmount);
        if (!receiverId)
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "receiverId is required");
        if (!amount || amount <= 0)
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
        if (receiverId === userId)
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot send money to self");
        // fetch wallets
        const senderWallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiverId }).session(session);
        if (!senderWallet)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender wallet not found");
        if (!receiverWallet)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver wallet not found");
        if (senderWallet.status !== "ACTIVE")
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sender wallet blocked");
        if (receiverWallet.status !== "ACTIVE")
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver wallet blocked");
        // Fee (5%)
        const fee = Math.ceil(amount * 0.05);
        const debit = amount + fee;
        if (senderWallet.balance < debit)
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
        // update balances
        senderWallet.balance -= debit;
        receiverWallet.balance += amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        // create single transaction record (sender-side only)
        yield transaction_model_1.Transaction.create([{
                type: transaction_interface_1.TransactionType.SEND_MONEY,
                amount,
                fee,
                fromUser: senderWallet.user,
                toUser: receiverWallet.user,
                initiatedBy: senderWallet.user,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
                meta: { method: "Send Money" }
            }], { session });
        yield session.commitTransaction();
        return { senderWallet, receiverWallet, fee };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// View My Transaction History
const getMyTransactions = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const sort = query.sortBy || "createdAt";
    // const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    const skip = (page - 1) * limit;
    const filter = {
        $or: [{ fromUser: userId }, { toUser: userId }],
    };
    const transactions = yield transaction_model_1.Transaction.find(filter)
        .populate("fromUser", "name phone")
        .populate("toUser", "name phone")
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments(filter);
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: transactions,
    };
});
// user wallet status update => admin
const blockWallet = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).populate("wallet", "_id balance status");
    if (!user || user.role !== "USER") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    const updateUser = user.wallet;
    updateUser.status = status;
    yield updateUser.save();
    return user;
});
exports.UserService = {
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
