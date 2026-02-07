import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';

import router from './routes/product';
import orderRouter from './routes/order';
import authRouter from './routes/auth';
import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';
import { requestLogger, errorLogger } from './middlewares/loggers';
import { PORT, DB_ADDRESS } from './config';

const app = express();

const dbName = 'weblarek';

const connectToDB = async () => {
  try {
    await mongoose.connect(DB_ADDRESS, { dbName });
  } catch (err) {
    console.error(err);
  }
};

connectToDB();

app.use(requestLogger);

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/product', router);
app.use('/order', orderRouter);
app.use('/auth', authRouter);

app.use((_req:Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Страница не найдена!'));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
