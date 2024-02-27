import joi from "joi";

export const categorySchema = joi.object({
    _id: joi.string(),
    name: joi.string().required().min(3).max(255),
    images: joi.object().required(),
    products: joi.array(),
})