import { Request, Response } from 'express';
import AuthService from './user.services';

export default class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async users(req: Request, res: Response) {
    try {
      const users = await this.authService.getAll();
      return res.json(users);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async findUsers(req: Request, res: Response) {
    try {
      const users = await this.authService.findUsers(req as any);
      return res.json(users);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const users = await this.authService.getUser(req);
      console.log(users);
      return res.json(users);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}
