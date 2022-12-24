import { Router } from 'express';
import AuthController from './user.controller';
import 'dotenv/config';
import UserService from './user.services';

const router = Router();

const newController = () => {
  const userService = new UserService();
  return new AuthController(userService);
};

router.get('/:email', (req, res) => newController().getUser(req, res));

export default router;
