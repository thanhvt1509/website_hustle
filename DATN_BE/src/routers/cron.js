import express from "express";
import { updateOrderStatus } from "../controllers/cron.js";
const routerCron = express.Router()

// router.get('/', getAll)
// router.get('/:id', get)
// router.post('/add', create)
// router.delete('/:id', remove)
routerCron.patch('/order', updateOrderStatus)

export default routerCron