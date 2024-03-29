import { Request, Response } from 'express';
import AuthService from './auth.services';
import AuthDto from './dto';

export default class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signup(req: Request, res: Response) {
    try {
      const tokens = await this.authService.signup(req.body as AuthDto);
      return res.json(tokens);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async signin(req: Request, res: Response) {
    try {
      const tokens = await this.authService.signin(req.body as AuthDto);
      return res.json(tokens);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async users(req: Request, res: Response) {
    try {
      const users = await this.authService.getAll();
      return res.json(users);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async updateUserAuth(req: Request, res: Response) {
    const { token } = req.headers as { token: string };
    const { email } = req.params as { email: string };
    try {
      const user = await this.authService.updateUserAuth(email, token);
      return res.status(201).json(user);
    } catch (err: any) {
      if (err.message === 'access denied') {
        return res.status(401).json({ error: 'access denied' });
      }
      return res.status(500).send(err);
    }
  }

  async validateToken(req, res, next) {
    const { token } = req.headers as { token: string };
    const tokens = await this.authService.validateToken(token) as { error?: string};

    if (tokens?.error) return res.json({ error: 'Accesso Negado' });
    return next();
  }

  async logout(req: Request) {
    const { email } = req.params;
    return this.authService.logout(email);
  }
}
