import { Router } from "express";
import sampleRouter from "./sample.js";


const router = Router();

router.get('/status', (req, res) => {
    console.log(req.url);
    res.json({ message: 'Server is live!', code: 200 });
});

router.use('/sample', sampleRouter)




export default router;