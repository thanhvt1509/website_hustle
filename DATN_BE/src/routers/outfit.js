import express from "express"
import { createOutfit, deleteOutfit, getAllOutfit, getOutfit, updateOutfit } from "../controllers/outfit.js";

const routerOutfit = express.Router();

routerOutfit.get(`/`, getAllOutfit)
routerOutfit.get(`/:id`, getOutfit)
routerOutfit.post(`/add`, createOutfit)
routerOutfit.patch(`/:id/edit`, updateOutfit)
routerOutfit.delete(`/:id`, deleteOutfit)



export default routerOutfit;