import { Request, Response } from 'express';
import JobsService from './jobs.services';

export default class JobsController {
  private readonly jobsService: JobsService;

  constructor(jobsService: JobsService) {
    this.jobsService = jobsService;
  }

  async listJobs(req: Request, res: Response) {
    try {
      const user = await this.jobsService.listJobs();

      return res.json(user);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async createJob(req: Request, res: Response) {
    try {
      const user = await this.jobsService.createJob(req.body);
      return res.json(user);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}
