import { Router } from "express";
import { auth } from "../middlewares/authMiddleware.js";
import CultRouter from "./cultRouter.js";
import sampleRouter from "./sample.js";
import UploadRouter from "./upload.js";
import userRouter from "./user.js";


const router = Router();

router.get('/status', (req, res) => {
    console.log(req.url);
    res.json({ message: 'Server is live!', code: 200 });
});

router.use('/sample', auth, sampleRouter)
router.use('/user', userRouter);
router.use('/upload', UploadRouter);
router.use('/cult', CultRouter);



export default router;