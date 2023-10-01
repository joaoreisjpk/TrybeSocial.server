import { Router } from 'express';
import AuthController from './user.controller';
import 'dotenv/config';

const router = Router();

router.get('/list', AuthController.listUsers);
router.get('/:userId', AuthController.getUser);

export default router;
