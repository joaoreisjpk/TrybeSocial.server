import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const controller = new AuthController();

router.post('/users', controller.users);

export { router as AuthRouter };
