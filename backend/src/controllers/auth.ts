import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ms from 'ms';

import User from '../models/user';
import UnathorizedError from '../errors/unathorized-error';
import { SECRET } from '../config';

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const accessToken = jwt.sign({ _id: user._id }, SECRET!, { expiresIn: '10m' });
      const refreshToken = jwt.sign({ _id: user._id }, SECRET!, { expiresIn: '7d' });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: ms('7d'),
        path: '/',
      });
      res.send({ user, success: true, accessToken });
    })
    .catch((err) => next(new UnathorizedError(err.message)));
};

export default login;
