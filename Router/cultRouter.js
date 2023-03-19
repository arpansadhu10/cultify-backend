import { Router } from "express";
import { createCult } from "../controller/cultController.js";


const CultRouter = Router();

CultRouter.post('/', createCult);
export default CultRouter;