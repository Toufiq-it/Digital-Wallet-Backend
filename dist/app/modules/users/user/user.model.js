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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    phone: { type: String, required: true, unique: true },
    wallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet", default: undefined, index: true },
    email: { type: String, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        // default: Role.USER,
    },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    isVarified: { type: Boolean, default: false },
    auth: [authProviderSchema],
    // wallet: [walletSchema],
}, {
    timestamps: true,
    versionKey: false
});
// create slug
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("name")) {
            const baseSlug = this.name.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}`;
            let counter = 0;
            while (yield exports.User.exists({ slug })) {
                slug = `${slug}-${counter++}`;
            }
            this.slug = slug;
        }
        next();
    });
});
// update slug
userSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this.getUpdate();
        if (user.name) {
            const baseSlug = user.name.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}`;
            let counter = 0;
            while (yield exports.User.exists({ slug })) {
                slug = `${slug}-${counter++}`;
            }
            user.slug = slug;
        }
        this.setUpdate(user);
        next();
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);
