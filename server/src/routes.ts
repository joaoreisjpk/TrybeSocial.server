import { Router } from 'express';
import { AuthRouter } from './auth/auth.routes';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/', (req, res) => res.send('booora'));

export default router;
