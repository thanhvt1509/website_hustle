
import express from "express";
import { vnpayIpn, vnpayMethod } from "../controllers/payment.js";
import { handleCreatePayment, momoIpn } from "../controllers/momo.js";

const routerPay = express.Router()
routerPay.post('/create_payment_url', vnpayMethod);
routerPay.get('/vnpay_ipn',vnpayIpn)
routerPay.post('/momo_payment', handleCreatePayment)
routerPay.post('/momo_ipn',momoIpn)




export default routerPay