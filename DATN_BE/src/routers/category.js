import express from "express"
import { create, deleteCategories, getCategories, getCategory, remove, update } from "../controllers/category.js";

const routerCategory = express.Router();

routerCategory.get(`/`,getCategories)
routerCategory.get(`/:id`,getCategory)
routerCategory.post(`/add`,create)
routerCategory.patch(`/:id/edit`,update)
routerCategory.delete(`/delete-categories`,deleteCategories)
routerCategory.delete(`/:id`,remove)



export default routerCategory;