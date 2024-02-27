import express from "express";
import { create, get, getAll, getAllByAdmin, getByAdmin, remove, update } from "../controllers/product.js";
import { checkPermission } from "../middlwares/checkPermission.js";

const router = express.Router()

router.get('/admin', checkPermission, getAllByAdmin)
router.get('/', getAll)
// router.get('/search', keyWordProduct)
router.get('/:id', get)
router.post('/add', checkPermission, create)
router.delete('/:id', checkPermission, remove)
router.patch('/:id', checkPermission, update)
router.get('/admin/:id', getByAdmin)


export default router