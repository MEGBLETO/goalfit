import Joi from "joi";

export const validateRegister = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    surname: Joi.string().required(),
  });
  return schema.validate(data);
};

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

export const validatePasswordResetRequest = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(data);
};

export const validatePasswordReset = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};