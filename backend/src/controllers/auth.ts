import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Error as MongooseError } from 'mongoose';
import ms from 'ms';

import User from '../models/user';
import {
  UnathorizedError, ConflictError, NotFoundError, BadRequestError, DefaultError,
} from '../errors/index';
import { SECRET } from '../config';

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const accessToken = jwt.sign({ _id: user._id }, SECRET!, { expiresIn: '10m' });
      const refreshToken = jwt.sign({ _id: user._id }, SECRET!, { expiresIn: '7d' });
      User.findByIdAndUpdate(
        user._id,
        { $push: { tokens: { token: refreshToken } } },
        { new: true },
      ).then((updatedUser) => {
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: ms('7d'),
          path: '/',
        });
        res.send({ updatedUser, success: true, accessToken });
      });
    })
    .catch((err) => next(new UnathorizedError(err.message)));
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          const accessToken = jwt.sign({ _id: user._id }, SECRET!, { expiresIn: '10m' });
          const refreshToken = jwt.sign({ _id: user._id }, SECRET!, { expiresIn: '7d' });
          User.findByIdAndUpdate(
            user._id,
            { $push: { tokens: { token: refreshToken } } },
            { new: true },
          ).then((updatedUser) => {
            res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              sameSite: 'lax',
              secure: false,
              maxAge: ms('7d'),
              path: '/',
            });
            res.send({ updatedUser, success: true, accessToken });
          });
        })
        .catch((err) => {
          if (err instanceof Error && err.message.includes('E11000')) {
            return next(new ConflictError('Ошибка: пользователь с таким email уже существует'));
          }
          if (err instanceof MongooseError.ValidationError) {
            return next(new BadRequestError(err.message));
          }
          return next(new DefaultError(`Ошибка сервера: ${err.message}`));
        });
    });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnathorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET!);
  } catch (err) {
    return next(new NotFoundError('Пользователь не найден'));
  }
  return User.findById(payload)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.send({ sucess: true, user });
      }
    })
    .catch((err) => next(new DefaultError(`Ошибка сервера: ${err.message}`)));
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return next(new UnathorizedError('Неправильный токен'));
  }
  const update = { $pull: { tokens: { token } } };
  return User.findOneAndUpdate({ 'tokens.token': token }, update)
    .then((updatedUser) => {
      if (!updatedUser) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.cookie('refreshToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: ms('1ms'),
        path: '/',
      });
      res.send({ success: true });
    })
    .catch((err) => next(new DefaultError(err.message)));
};

export const refreshAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(new UnathorizedError('Неправильный токен'));
  }
  return User.findOne({ 'tokens.token': token })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      const accessToken = jwt.sign({ _id: user?._id }, SECRET!, { expiresIn: '10m' });
      const refreshToken = jwt.sign({ _id: user?._id }, SECRET!, { expiresIn: '7d' });
      return User.findByIdAndUpdate(
        user?._id,
        { $push: { tokens: { token: refreshToken } } },
        { new: true },
      ).then((updatedUser) => {
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: ms('7d'),
          path: '/',
        });
        res.send({ updatedUser, success: true, accessToken });
      });
    })
    .catch((err) => next(new DefaultError(`Ошибка сервера: ${err.message}`)));
};
