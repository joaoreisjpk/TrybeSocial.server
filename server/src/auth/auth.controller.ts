import { Request, Response } from 'express';
import { AuthService } from './auth.services';
import { AuthDto } from './dto';

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response) {
    const user = await authService.signup(req.body as AuthDto);
    return res.json(user);
  }

  async signin(req: Request, res: Response) {
    const user = await authService.signin(req.body as AuthDto);
    return res.json(user);
  }

  async users(req: Request, res: Response) {
    const users = await authService.getAll();
    return res.json(users);
  }

  async refreshTokens(req: Request, res: Response) {
    const { id } = req.params;
    const { token } = req.headers as { token: string };
    const tokens = await authService.refreshTokens(Number(id), token);
    return res.json(tokens);
  }

  async logout(req: Request, res: Response) {
    const { id } = req.params;
    const tokens = await authService.logout(Number(id));
    return res.json(tokens);
  }
}
