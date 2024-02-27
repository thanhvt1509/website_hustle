import express from "express";
import { create } from "../controllers/color.js";
import { sendMail } from "../controllers/mailer.js";

const routerMailer = express.Router()

routerMailer.post('/send', sendMail)

export default routerMailer