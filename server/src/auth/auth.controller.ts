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
    const { email } = req.params;
    const { token } = req.headers as { token: string };
    const tokens = await authService.refreshTokens(email, token);
    return res.json(tokens);
  }

  async logout(req: Request, _res: Response) {
    const { email } = req.params;
    await authService.logout(email);
  }
}
