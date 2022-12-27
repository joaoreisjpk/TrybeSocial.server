import { Router } from 'express';
import AuthRouter from './auth/auth.routes';
import UserRouter from './user/user.routes';
import JobsRouter from './jobs/jobs.routes';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/jobs', JobsRouter);
router.use('/', (req, res) => res.send('booora'));

export default router;
