import express from "express";
import { get, getAll, remove, update } from "../controllers/order_detail.js";
const router = express.Router()

router.get('/', getAll),
    router.get('/:id', get),
    router.patch('/:id/update', update)
router.delete('/:id', remove)

export default router