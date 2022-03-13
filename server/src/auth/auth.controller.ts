import { Request, Response } from 'express';
import { AuthService } from './auth.services';
import { AuthDto } from './dto';

const authService = new AuthService();

export class AuthController {
  /* signup(req: Request, res: Response) {
    const user = authService.signup(req.body as AuthDto);

    return res.json(user);
  } */

  /* async signin(req: Request, res: Response) {
    const user = await authService.signin(req.body as AuthDto);
    return res.json(user);
  } */

  async users(req: Request, res: Response) {
    const users = await authService.getAll();
    return res.json(users);
  }
}
