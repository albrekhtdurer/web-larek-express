import { Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = (req: Request, res: Response) => Product.find({})
  .then((result) => res.send({ items: result, total: result.length }))
  .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));

export const createProduct = (req: Request, res: Response) => {
  const {
    description, image, title, category, price,
  } = req.body;
  Product.create({
    description, image, title, category, price,
  })
    .then((product) => res.send(product))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};
