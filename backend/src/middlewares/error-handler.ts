import { isCelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

const errorHandler = (
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    if (isCelebrateError(err)) {
      statusCode = 400;
    }
    res.status(statusCode).send({ message: err.message });
  }
);

export default errorHandler;
