import Joi from "joi";

export const reviewSchema = Joi.object({
  productId: Joi.string(),
  userId: Joi.string(),
  rating: Joi.number(),
  comment: Joi.string().required(),
  images: Joi.array().required(),
  color: Joi.string(),
  size: Joi.string()
});

export const replySchema = Joi.object({
  nameUser: Joi.string().default('Admin'),
  comment: Joi.string().required(),
  userId: Joi.string()
});
