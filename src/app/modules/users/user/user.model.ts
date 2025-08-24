import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    versionKey: false,
    _id: false,
})

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    phone: { type: String, required: true, unique: true },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet", default: undefined, index: true },
    email: { type: String, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(Role),
        // default: Role.USER,
    },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE,
    },
    isVarified: { type: Boolean, default: false },
    auth: [authProviderSchema],
    // wallet: [walletSchema],
}, {
    timestamps: true,
    versionKey: false
});

// auto-populate wallet on any find/findOne/findById
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function autoPopulateWallet(this: any, next: NextFunction) {
//   this.populate("wallet");
//   next();
// }
// // userSchema.pre("find", autoPopulateWallet);
// // UserSchema.pre("findOne", autoPopulateWallet);
// // UserSchema.pre("findOneAndUpdate", autoPopulateWallet);
// userSchema.pre("findById", autoPopulateWallet);


// create slug
userSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        const baseSlug = this.name.toLowerCase().split(" ").join("-");
        let slug = `${baseSlug}`;

        let counter = 0;
        while (await User.exists({ slug })) {
            slug = `${slug}-${counter++}`;
        }
        this.slug = slug;
    }
    next();
});


// update slug
userSchema.pre("findOneAndUpdate", async function (next) {
    const user = this.getUpdate() as Partial<IUser>

    if (user.name) {
        const baseSlug = user.name.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}`

        let counter = 0;
        while (await User.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }
        user.slug = slug
    }

    this.setUpdate(user);
    next();
});

export const User = model<IUser>("User", userSchema);