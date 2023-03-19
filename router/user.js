import { Router } from "express";
import { login, signup, verifyEmail } from "../controller/userConroller.js";
import { createUserValidator } from "../validator/userValidator.js";

const userRouter = Router();



userRouter.get('/')
userRouter.post('/', createUserValidator, signup);
userRouter.post('/login', login);
userRouter.post('/verify-email', verifyEmail);


export default userRouter;
