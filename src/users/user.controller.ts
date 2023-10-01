import { Request, Response } from 'express';
import AuthService from './user.services';

export default class AuthController {
  static async listUsers(req: Request, res: Response) {
    try {
      const users = await AuthService.findUsers(req as any);
      return res.json(users);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  static async getUser(req: Request, res: Response) {
    console.log('getUser');
    try {
      const users = await AuthService.getUser(req);
      return res.json(users);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}
