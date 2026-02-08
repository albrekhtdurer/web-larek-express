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
import auth from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/login', validateLoginBody, login);

authRouter.post('/register', validateRegisterBody, register);

authRouter.get('/token', validateRefreshTokenCookie, refreshAccessToken);

authRouter.get('/logout', validateRefreshTokenCookie, logout);

authRouter.get('/user', auth, validateAuthorizationHeaders, getCurrentUser);

export default authRouter;
