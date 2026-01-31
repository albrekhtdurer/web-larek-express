import { NextFunction, Request, Response } from 'express';

const errorHandler = (
  (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode).send(err.message);
  }
);

export default errorHandler;
