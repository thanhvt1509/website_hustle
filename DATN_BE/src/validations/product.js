import joi from "joi";
export const productSchema = joi.object({
    title: joi.string().required(),
    sku: joi.string(),
    price: joi.number().required().min(0),
    discount: joi.number().min(0),
    costPrice: joi.number().required().min(0),
    description: joi.string(),
    images: joi.array().required(),
    variants: joi.array(),
    categoryId: joi.string().required(),
    hide: joi.boolean(),
    deleted: joi.boolean().default(false),
});
