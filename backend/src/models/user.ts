import bcrypt from 'bcrypt';
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

interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>
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
    select: false,
  },
  tokens: {
    type: [tokenSchema],
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user: IUser) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched: boolean) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильная почта или пароль'));
          }
          return user;
        });
    });
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
