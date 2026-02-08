import { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';
import { Error as MongooseError } from 'mongoose';
import path from 'path';

import Product from '../models/product';
import DefaultError from '../errors/default-error';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => Product.find({})
  .then((result) => res.send({ items: result, total: result.length }))
  .catch((err) => next(new DefaultError(`Ошибка сервера: ${err.message}`)));

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    description, image, title, category, price,
  } = req.body;
  const tmpFileName = path.join(__dirname, `../uploads${image.fileName}`);
  const newFilename = path.join(__dirname, `../public${image.fileName}`);
  fs.rename(tmpFileName, newFilename)
    .then(() => {
      Product.create({
        description, image, title, category, price,
      })
        .then((product) => res.send(product))
        .catch((err) => {
          if (err instanceof Error && err.message.includes('E11000')) {
            next(new ConflictError('Ошибка: товар с таким title уже существует'));
          } else if (err instanceof MongooseError.ValidationError) {
            next(new BadRequestError(err.message));
          }
          next(new DefaultError(`Ошибка сервера: ${err.message}`));
        });
    });
};
