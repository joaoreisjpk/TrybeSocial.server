import { Router } from 'express';
import { AuthController } from './auth.controller';
import 'dotenv/config';

const router = Router();
const controller = new AuthController();

router.get('/users', controller.users);
router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.post('/refresh/:id', controller.refreshTokens);
router.post('/logout/:email', controller.logout);

export { router as AuthRouter };
