import joi from "joi";

export const colorSchema = joi.object({
    color: joi.string().required(),
    color_code: joi.string().required(),
})