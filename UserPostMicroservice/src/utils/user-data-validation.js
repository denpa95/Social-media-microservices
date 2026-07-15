const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const validatePostCreationData = (userData) => {
  const schema = Joi.object({
    content: Joi.string().required().min(2).max(250),
    mediaIds: Joi.array().items(Joi.string()),
  });
  return schema.validate(userData);
};

const validatePostId = (userData) => {
  const schema = Joi.objectId().required();
  return schema.validate(userData);
};

module.exports = { validatePostCreationData, validatePostId };
