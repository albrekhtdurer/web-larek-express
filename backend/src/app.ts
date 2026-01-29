import express from 'express';
import mongoose from 'mongoose';

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

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
