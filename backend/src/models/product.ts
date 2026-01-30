import mongoose from 'mongoose';

interface IProduct {
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
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
    maxLength: 30,
  },
  image: imageSchema,
  category: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    default: null,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
