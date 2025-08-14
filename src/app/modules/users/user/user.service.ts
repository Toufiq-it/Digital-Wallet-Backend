import { IUser } from "./user.interface";
import { User } from "./user.model";



// create user
const createUser = async (payload: Partial<IUser>) => {

    const {name, email,phone, ...rest } = payload;

     const user = await User.create({
        name,
        email,
        phone,
        // auth: [authProvider],
        ...rest,
    })

    return user;
};


export const UserService = {
    createUser,
};