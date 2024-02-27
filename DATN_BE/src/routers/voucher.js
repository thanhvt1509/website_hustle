import express from "express"
import { getVoucherById, getVouchers, create, update, deleteVouchers, remove } from "../controllers/voucher.js";


const routerVoucher = express.Router();

routerVoucher.get(`/`, getVouchers)
routerVoucher.get(`/:id`, getVoucherById)
routerVoucher.post(`/add`, create)
routerVoucher.patch(`/:id/edit`, update)
routerVoucher.delete(`/delete-categories`, deleteVouchers)
routerVoucher.delete(`/:id`, remove)

export default routerVoucher;