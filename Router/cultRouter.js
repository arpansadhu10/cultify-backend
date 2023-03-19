import { Router } from "express";
import { createCult, getAllCults, getTopCults } from "../controller/cultController.js";


const CultRouter = Router();

CultRouter.post('/', createCult);
CultRouter.get('/', getAllCults);
CultRouter.get('/top', getTopCults);
export default CultRouter;