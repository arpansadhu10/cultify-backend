import { Router } from "express";
import { createCult, getAllCults, getTopCults, joinCult, leaveCult } from "../controller/cultController.js";
import { auth } from "../middlewares/authMiddleware.js";


const CultRouter = Router();

CultRouter.post('/', auth, createCult);
CultRouter.get('/', getAllCults);
CultRouter.get('/top', getTopCults);
CultRouter.get('/:cult/join', auth, joinCult);
CultRouter.get('/:cult/leave', auth, leaveCult);
export default CultRouter;