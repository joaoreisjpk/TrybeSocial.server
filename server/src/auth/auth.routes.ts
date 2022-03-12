import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const controller = new AuthController();

router.post('/signin', controller.signin);

export { router as AuthRouter };
