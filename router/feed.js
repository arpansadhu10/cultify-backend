import { Router } from "express"
import { generateFeed } from "../controller/feedController.js";
import { auth } from "../middlewares/authMiddleware.js";

const FeedRouter = Router();

FeedRouter.get('/', auth, generateFeed);


export default FeedRouter;