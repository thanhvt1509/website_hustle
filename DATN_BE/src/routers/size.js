import express from "express"
// import { create, deleteCategories, getSizes, getCategory, remove, update } from "../controllers/category.js";
import { create } from "../controllers/size.js";

const routerSize = express.Router();

// routerSize.get(`/`,getSizes)
// routerSize.get(`/:id`,getCategory)
routerSize.post(`/add`, create)
// routerSize.patch(`/:id/edit`,update)
// routerSize.delete(`/delete-categories`,deleteCategories)
// routerSize.delete(`/:id`,remove)



export default routerSize;