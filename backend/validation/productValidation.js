const Joi = require("joi");

const productSchema = Joi.object({
  seller: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  category: Joi.string().allow("").optional(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
});

module.exports = { productSchema };
