import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import router from './routes/product';
import orderRouter from './routes/order';

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

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/product', router);
app.use('/order', orderRouter);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
