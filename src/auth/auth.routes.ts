import { Router } from 'express';
import AuthController from './auth.controller';
import 'dotenv/config';
import { AuthService } from './auth.services';

const router = Router();

const newController = () => {
  const authService = new AuthService();
  const controller = new AuthController(authService);
  return controller;
};

router.get('/users', (req, res) => newController().users(req, res));
router.post('/signup', (req, res) => newController().signup(req, res));
router.post('/signin', (req, res) => newController().signin(req, res));
router.post('/refresh/:id', (req, res) => newController().refreshTokens(req, res));
router.post('/logout/:email', (req) => newController().logout(req));

export default router;
