import { Request, Response } from 'express';
import UserService from './user.services';

export default class AuthController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getUser(req: Request, res: Response) {
    const { email } = req.params;
    const user = await this.userService.getUser(email);
    return res.json(user);
  }
}
