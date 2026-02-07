import { Router } from 'express';
import {
  login, register, getCurrentUser, logout,
  refreshAccessToken,
} from '../controllers/auth';
import {
  validateAuthorizationHeaders,
  validateLoginBody,
  validateRefreshTokenCookie,
  validateRegisterBody,
} from '../middlewares/validators';

const authRouter = Router();

authRouter.post('/login', validateLoginBody, login);

authRouter.post('/register', validateRegisterBody, register);

authRouter.get('/token', validateRefreshTokenCookie, refreshAccessToken);

authRouter.get('/logout', validateRefreshTokenCookie, logout);

authRouter.get('/user', validateAuthorizationHeaders, getCurrentUser);

export default authRouter;
