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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const user_model_1 = require("../modules/users/user/user.model");
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/users/user/user.interface");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAdminExist = yield user_model_1.User.findOne({ role: "ADMIN" });
        if (isAdminExist) {
            console.log("Admin already exist");
            return;
        }
        const hasdedPassword = yield bcryptjs_1.default.hash(env_1.envVars.ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: "credential",
            providerId: env_1.envVars.ADMIN_EMAIL
        };
        const payload = {
            name: "Admin",
            role: user_interface_1.Role.ADMIN,
            phone: "01717232757",
            email: env_1.envVars.ADMIN_EMAIL,
            password: hasdedPassword,
            isVarified: true,
            auth: [authProvider],
            slug: ''
        };
        const admin = yield user_model_1.User.create(payload);
        console.log("Admin created successfully!! \n");
        console.log(admin);
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedAdmin = seedAdmin;
