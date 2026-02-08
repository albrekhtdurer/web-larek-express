import { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';
import { Document, Error as MongooseError, Types } from 'mongoose';
import path from 'path';

import Product, { IProduct } from '../models/product';
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

export const updateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const payload = req.body;
  const updateObj: Record<string, unknown> = {};
  let result: (Document<unknown, {}, IProduct> & IProduct & { _id: Types.ObjectId; }) | null = null;
  Object.entries(payload).forEach((entry) => {
    const key = entry[0];
    const value = entry[1];
    if (typeof value !== 'undefined' && value !== null && value) {
      updateObj[key] = value;
    }
  });
  Product.findByIdAndUpdate(productId, updateObj)
    .then((updatedProduct) => {
      result = updatedProduct;
      if (payload.image && payload.image.fileName && payload.image.originalName) {
        const tmpFileName = path.join(__dirname, `../uploads${payload.image.fileName}`);
        const newFilename = path.join(__dirname, `../public${payload.image.fileName}`);
        fs.rename(tmpFileName, newFilename)
          .then(() => { res.send(result); });
      } else {
        res.send(result);
      }
    })
    .catch((err) => {
      if (err instanceof Error && err.message.includes('E11000')) {
        next(new ConflictError('Ошибка: товар с таким title уже существует'));
      } else if (err instanceof MongooseError.ValidationError) {
        next(new BadRequestError(err.message));
      }
      next(new DefaultError(`Ошибка сервера: ${err.message}`));
    });
};
