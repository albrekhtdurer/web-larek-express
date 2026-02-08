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

const productUpdateSchema = Joi.object({
  title: Joi.string(),
  category: Joi.string(),
  description: Joi.string(),
  image: Joi.object({
    fileName: Joi.string(),
    originalName: Joi.string(),
  }),
  price: Joi.number().default(null),
});

export const validateProductUpdateBody = celebrate({ [Segments.BODY]: productUpdateSchema });

const orderSchema = Joi.object({
  payment: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().items(Joi.string()).required(),
});

export const validateOrderBody = celebrate({ [Segments.BODY]: orderSchema });

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const validateLoginBody = celebrate({ [Segments.BODY]: loginSchema });

const newUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const validateRegisterBody = celebrate({ [Segments.BODY]: newUserSchema });

export const validateAuthorizationHeaders = celebrate(
  { [Segments.HEADERS]: Joi.object({ authorization: Joi.string().required() }).unknown() },
);

export const validateRefreshTokenCookie = celebrate(
  { [Segments.COOKIES]: Joi.object({ refreshToken: Joi.string().required() }).unknown() },
);
