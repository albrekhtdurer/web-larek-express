import { celebrate, Joi, Segments } from 'celebrate';

const productSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string(),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }),
  price: Joi.number().default(null),
});

export const validateProductBody = celebrate({ [Segments.BODY]: productSchema });

const orderSchema = Joi.object({
  payment: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().items(Joi.string()).required(),
});

export const validateOrderBody = celebrate({ [Segments.BODY]: orderSchema });
