import { Router } from "express";
import { auth } from "../middlewares/authMiddleware.js";
import CultRouter from "./cultRouter.js";
import PostRouter from "./postRouter.js";
import sampleRouter from "./sample.js";
import UploadRouter from "./upload.js";
import userRouter from "./user.js";
import FeedRouter from "./feed.js";


const router = Router();

router.get('/status', (req, res) => {
    console.log(req.url);
    res.json({ message: 'Server is live!', code: 200 });
});

router.use('/sample', auth, sampleRouter)
router.use('/user', userRouter);
router.use('/upload', UploadRouter);
router.use('/cult', CultRouter);
router.use('/post', PostRouter);
router.use('/feed', FeedRouter);



export default router;