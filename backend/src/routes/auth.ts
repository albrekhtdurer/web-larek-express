import { Router, Request, Response } from 'express';

const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) => {
  console.log(req);
  console.log(res);
});

authRouter.post('/register', (req: Request, res: Response) => {
  console.log(req);
  console.log(res);
});

authRouter.get('/token', (req: Request, res: Response) => {
  console.log(req);
  console.log(res);
});

authRouter.get('/logout', (req: Request, res: Response) => {
  console.log(req);
  console.log(res);
});

authRouter.post('/user', (req: Request, res: Response) => {
  console.log(req);
  console.log(res);
});

export default authRouter;
