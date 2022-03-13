import argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import jwt from 'jsonwebtoken';

export class AuthService {
  prisma: PrismaClient;
  secret: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.secret = process.env.JWT_SECRET;
  }

  async signup(dto: AuthDto) {
    const { email, password, firstName, lastName } = dto;
    const hash = await argon.hash(password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          email,
          hash,
          firstName,
          lastName,
        },
      });

      const tokens = await this.getTokens(newUser.id, newUser.email);
      await this.updateRtHash(newUser.id, tokens.refresh_token);

      return tokens;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          return { error: 'Email já utilizado' };
        }
      }
      return { error: err };
    }
  }

  async signin({ email, password }: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return { error: 'Email ou Senha incorretos' };

    const pwMatches = await argon.verify(user.hash, password);
    if (!pwMatches) return { error: 'Email ou Senha incorretos' };

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async getAll() {
    return this.prisma.user.findMany();
  }

  // TODO
  async logout(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: { tokenRt: null },
    });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.tokenRt) return { error: 'Access Denied' };

    const rtMatches = await argon.verify(user.tokenRt, rt);
    if (!rtMatches) return { error: 'Access Denied' };

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        tokenRt: hash,
      },
    });
  }

  async getTokens(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const at = jwt.sign(payload, this.secret, {
      algorithm: 'HS256',
      expiresIn: '15min',
    });

    const rt = jwt.sign(payload, this.secret, {
      algorithm: 'HS256',
      expiresIn: '7d',
    });

    return {
      acess_token: at,
      refresh_token: rt,
    };
  }
}
