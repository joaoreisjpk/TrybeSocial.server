import { Router } from 'express';
import AuthController from './jobs.controller';
import 'dotenv/config';
import UserService from './jobs.services';

const router = Router();

const newController = () => {
  const userService = new UserService();
  return new AuthController(userService);
};

router.get('/', (req, res) => newController().listJobs(req, res));
router.post('/', (req, res) => newController().createJob(req, res));

export default router;
