import { Request, Response } from 'express';
import { AuthService } from './auth.services';
import AuthDto from './dto';

export default class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signup(req: Request, res: Response) {
    const tokens = await this.authService.signup(req.body as AuthDto);
    return res.json(tokens);
  }

  async signin(req: Request, res: Response) {
    const tokens = await this.authService.signin(req.body as AuthDto);
    return res.json(tokens);
  }

  async users(req: Request, res: Response) {
    const users = await this.authService.getAll();
    return res.json(users);
  }

  async refreshTokens(req: Request, res: Response) {
    const { id } = req.params;
    const { token } = req.headers as { token: string };
    const tokens = await this.authService.refreshTokens(Number(id), token);
    return res.json(tokens);
  }

  async logout(req: Request) {
    const { email } = req.params;
    return this.authService.logout(email);
  }
}
