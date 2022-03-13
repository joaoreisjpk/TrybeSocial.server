import argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import jwt from 'jsonwebtoken';

export class AuthService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async signup(dto: AuthDto) {
    const { email, password, firstName, lastName } = dto;
    const hash = await argon.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          hash,
          firstName,
          lastName,
        },
      });

      return user;

      return this.signToken(user.id, user.email);
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

    return this.signToken(user.id, user.email);
  }

  async getAll() {
    return this.prisma.user.findMany();
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secret, {
      algorithm: 'HS256',
      expiresIn: '15min',
    });

    return { acess_token: token };
  }
}
