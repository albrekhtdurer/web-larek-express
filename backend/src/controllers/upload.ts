import { NextFunction, Request, Response } from 'express';

import { BadRequestError } from '../errors';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new BadRequestError('Нет файла!'));
  }
  return res.send({
    fileName: req.file.filename,
    originalName: req.file.originalname,
  });
};

export default uploadFile;
