import joi from "joi";
export const productDetailSchema = joi.object({
    product_id: joi.string().required(),
    nameColor: joi.string().required(),
    size: joi.string().required(),
    sold: joi.number().required().min(0),
    quantity: joi.number().required().min(0),
    imageColor: joi.string().required(),
    createdAt: joi.date().default(() => new Date()),
    updatedAt: joi.date().default(() => new Date()),
    deleted: joi.boolean().default(false),
});
