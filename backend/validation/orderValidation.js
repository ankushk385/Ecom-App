const Joi = require('joi');

const orderSchema = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      qty: Joi.number().integer().min(1).required(),
      price: Joi.number().positive().required()
    })
  ).min(1).required(),
  coupon: Joi.string().allow('').optional(),
  useWallet: Joi.boolean().optional()
});

module.exports = { orderSchema };
