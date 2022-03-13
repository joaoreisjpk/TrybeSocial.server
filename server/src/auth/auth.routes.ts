import { Router } from 'express';
import { AuthController } from './auth.controller';
import 'dotenv/config';

const router = Router();
const controller = new AuthController();

router.get('/users', controller.users);
router.post('/signup', controller.signup);
router.post('/signin', controller.signin);

export { router as AuthRouter };
