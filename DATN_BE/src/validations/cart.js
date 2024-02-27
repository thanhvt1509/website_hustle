import joi from "joi";

export const cartSchema = joi.object({
    productDetailId: joi.string().required(),
    quantity: joi.number().min(0).required(),
    totalMoney: joi.number().min(0).required()
})