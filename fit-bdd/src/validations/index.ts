import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  surname: Joi.string().required(),
  password: Joi.string().optional(),
  googleId: Joi.string().optional(),
  xId: Joi.string().optional(),
});

export const idSchema = Joi.number().integer().required();

export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const tokenSchema = Joi.object({
  token: Joi.string().required(),
});