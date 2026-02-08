import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../config';
import { UnathorizedError } from '../errors';

const auth = (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnathorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    jwt.verify(token, SECRET);
  } catch (err) {
    return next(new UnathorizedError('Необходима авторизация'));
  }

  return next();
};

export default auth;
