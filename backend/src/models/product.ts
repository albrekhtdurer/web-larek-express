import mongoose from 'mongoose';

import { deleteFileMiddleware } from '../middlewares/file';

export interface IProduct {
  title: string;
  image: string;
  category: string;
  description: string;
  price: number;
}

interface IImage {
  fileName: string;
  originalName: string;
}

const imageSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: [true, 'Поле "fileName" должно быть заполнено'],
  },
  originalName: {
    type: String,
    required: [true, 'Поле "originalName" должно быть заполнено'],
  },
});

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
    unique: true,
    minLength: [2, 'Минимальная длина поля "title" - 2'],
    maxLength: [30, 'Максимальная длина поля "title" - 30'],
  },
  image: imageSchema,
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: String,
  price: {
    type: Number,
    default: null,
  },
});

productSchema.post('findOneAndDelete', (doc) => {
  const imagePath = doc.image.fileName;
  deleteFileMiddleware(imagePath);
});

export default mongoose.model<IProduct>('product', productSchema);
