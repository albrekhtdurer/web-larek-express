import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import { Document, Types } from 'mongoose';

import Product, { IProduct } from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import DefaultError from '../errors/default-error';

const createOrder = (req: Request, res: Response, next: NextFunction) => {
  const { total, items } = req.body;

  Product.find({ _id: { $in: items } })
    .then((docs) => {
      const ids = docs.map((doc) => doc._id.toString());
      type TDoc = Document<unknown, {}, IProduct> & IProduct & {
        _id: Types.ObjectId;
      }
      const mappedDocs: TDoc[] = items.map((item: string) => docs.find(
        (doc) => doc._id.toString() === item,
      ));
      const notFoundItem = items.find((item: string) => !ids.includes(item));
      if (notFoundItem) {
        return next(new BadRequestError(`Товар с id ${notFoundItem} не найден`));
      }
      const nullPriceItem = mappedDocs.find((doc) => doc.price == null);
      if (nullPriceItem) {
        return next(new BadRequestError(`Товар с id ${nullPriceItem._id.toString()} не продается`));
      }
      const totalSum = mappedDocs.reduce((acc, currentDoc) => acc + currentDoc.price, 0);
      if (totalSum !== total) {
        return next(new BadRequestError('Неправильная сумма'));
      }
      return res.send({
        id: faker.string.uuid(),
        total,
      });
    })
    .catch((err) => next(new DefaultError(err.message)));
};

export default createOrder;
