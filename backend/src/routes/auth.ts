import { Router, Request, Response } from 'express';
import login from '../controllers/auth';
import { validateLoginBody } from '../middlewares/validators';

const authRouter = Router();

authRouter.post('/login', validateLoginBody, login);

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
