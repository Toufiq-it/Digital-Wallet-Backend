import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();


router.post("/register", 
    validateRequest(createUserZodSchema), 
    userController.createUser
);

router.get("/all-users", checkAuth(Role.ADMIN), validateRequest(createUserZodSchema), userController.getAllUsers);

router.patch("/:id", 
    validateRequest(updateUserZodSchema), 
    checkAuth(...Object.values(Role)), 
    userController.updateUser
);

export const UserRoutes = router;