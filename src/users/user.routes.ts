import { Router } from 'express';
import AuthController from './user.controller';
import 'dotenv/config';
import AuthService from './user.services';

const router = Router();

const newController = () => {
  const authService = new AuthService();
  const controller = new AuthController(authService);
  return controller;
};

router.get('/list', (req, res) => newController().findUsers(req, res));
router.get('/:userId', (req, res) => newController().getUser(req, res));

export default router;
