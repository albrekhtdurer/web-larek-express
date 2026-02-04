import mongoose from 'mongoose';

interface IToken {
  token: string;
}

interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: IToken[];
}

const tokenSchema = new mongoose.Schema<IToken>({
  token: {
    type: String,
  },
});

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minLength: [2, 'Минимальная длина поля "name" - 2'],
    maxLength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Ё-мое',
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле  "password" должно быть заполнено'],
  },
  tokens: {
    type: [tokenSchema],
  },
});

export default mongoose.model<IUser>('user', userSchema);
