import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';
import DefaultError from '../errors/default-error';

export const getProducts = (req: Request, res: Response, next: NextFunction) => Product.find({})
  .then((result) => res.send({ items: result, total: result.length }))
  .catch((err) => next(new DefaultError(`Ошибка сервера: ${err.message}`)));

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const {
    description, image, title, category, price,
  } = req.body;
  Product.create({
    description, image, title, category, price,
  })
    .then((product) => res.send(product))
    .catch((err) => next(new DefaultError(`Ошибка сервера: ${err.message}`)));
};
