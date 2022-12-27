import { Request, Response } from 'express';
import JobsService from './labs.services';

export default class JobsController {
  private readonly jobsService: JobsService;

  constructor(jobsService: JobsService) {
    this.jobsService = jobsService;
  }

  async listLabs(req: Request, res: Response) {
    const user = await this.jobsService.listLabs();
    return res.json(user);
  }

  async createLab(req: Request, res: Response) {
    const user = await this.jobsService.createLab(req.body);
    return res.json(user);
  }
}
