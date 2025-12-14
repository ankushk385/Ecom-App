const Joi = require("joi");

const productSchema = Joi.object({
  seller: Joi.string().optional(),
  sellerId: Joi.string().optional(),
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
}).unknown(true);

module.exports = { productSchema };
