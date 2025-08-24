import { User } from '../modules/users/user/user.model';
import { envVars } from '../config/env';
import { IAuthProvider, IUser, Role } from '../modules/users/user/user.interface';
import bcryptjs from 'bcryptjs';

export const seedAdmin = async ()=>{
    try {
        const isAdminExist = await User.findOne({ role: "ADMIN"})
        if (isAdminExist) {
            console.log("Admin already exist");
            return;
        }
        console.log("Trying to create admin...");
        

        const hasdedPassword = await bcryptjs.hash(envVars.ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));

        const authProvider: IAuthProvider = {
            provider: "credential",
            providerId: envVars.ADMIN_EMAIL
        }

        const payload: IUser = {
            name: "Admin",
            role: Role.ADMIN,
            phone: "01717232757",
            email: envVars.ADMIN_EMAIL,
            password: hasdedPassword,
            isVarified: true,
            auth: [authProvider],
            slug: ''
        }

        const admin = await User.create(payload)
        console.log("Admin created successfully!! \n");
        console.log(admin);
        
        
    } catch (error) {
        console.log(error);
        
    }
}