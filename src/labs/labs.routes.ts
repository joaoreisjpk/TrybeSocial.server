import { Router } from 'express';
import LabsController from './labs.controller';
import 'dotenv/config';
import LabsService from './labs.services';

const router = Router();

const newController = () => {
  const labsService = new LabsService();
  return new LabsController(labsService);
};

router.get('/', (req, res) => newController().listLabs(req, res));
router.post('/', (req, res) => newController().createLab(req, res));

export default router;
