import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';

const fileFilter = (_req: Request, file: Request['file'], cb: FileFilterCallback) => {
  const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (allowedFileTypes.includes(file!.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Request['file'], cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (_req, file, cb) => {
    const splittedFilePath = file!.originalname.split('.');
    const extension = splittedFilePath[splittedFilePath.length - 1];
    const newFileName = `${nanoid(10)}.${extension}`;
    cb(null, `/images/${newFileName}`);
  },
});

const fileMiddleware = multer({
  storage, limits: { fieldSize: 5 * 1024 * 1024 }, fileFilter,
});

export default fileMiddleware;
