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

const app = express();

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

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

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/product', router);
app.use('/order', orderRouter);
app.use('/auth', authRouter);

app.use((req:Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Страница не найдена!'));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
