import { Router } from 'express';
import AuthRouter from './auth/auth.routes';
import JobsRouter from './jobs/jobs.routes';
import UserRouter from './users/user.routes';
import LabsRouter from './labs/labs.routes';
import AuthController from './auth/auth.controller';
import AuthService from './auth/auth.services';

const router = Router();

const validateToken = (req, res, next) => {
  const authService = new AuthService();
  return new AuthController(authService).validateToken(req, res, next);
};

router.use('/auth', AuthRouter);
router.use('/user', validateToken, UserRouter);
router.use('/jobs', validateToken, JobsRouter);
router.use('/labs', validateToken, LabsRouter);
router.use('/', (req, res) => res.send('booora v5'));

export default router;
