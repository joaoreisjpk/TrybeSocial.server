import { Router } from 'express';
import JobsController from './jobs.controller';
import 'dotenv/config';
import JobsService from './jobs.services';

const router = Router();

const newController = () => {
  const jobsService = new JobsService();
  return new JobsController(jobsService);
};

router.get('/', (req, res) => newController().listJobs(req, res));
router.post('/', (req, res) => newController().createJob(req, res));

export default router;
