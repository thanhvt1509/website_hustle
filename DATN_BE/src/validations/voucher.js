import Joi from "joi";

const validVoucherTypes = ["percent", "value", "Type3"]; // Thay thế bằng các loại Voucher cụ thể

export const voucherValidationSchema = Joi.object({
    _id: Joi.string(),
    title: Joi.string().required(),
    type: Joi.string().valid(...validVoucherTypes).required(),
    code: Joi.string().required(),
    quantity: Joi.number().integer().min(0).allow(null),
    discount: Joi.number().min(0).required(),
    used: Joi.number().integer().min(0),
    minOrderValue: Joi.number().default(0),
    maxOrderValue: Joi.number().default(0),
    validFrom: Joi.date().iso().required(),
    validTo: Joi.date().iso().greater(Joi.ref('validFrom')).allow(null),
    description: Joi.string(),
    status: Joi.boolean().default(true),
});
