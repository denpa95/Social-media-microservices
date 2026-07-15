const Joi = require("joi");

const validateRegistrationData = (userData) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(userData);
};

const validateLoginData = (userData) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(userData);
};

const validateRefreshToken = (userData) => {
  const schema = Joi.object({
    refreshToken: Joi.string().hex().required(),
  });

  return schema.validate(userData);
};

module.exports = {
  validateRegistrationData,
  validateLoginData,
  validateRefreshToken,
};
