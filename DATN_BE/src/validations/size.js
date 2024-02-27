import joi from "joi";

export const sizeSchema = joi.object({
    size: joi.string().required().max(10),
})