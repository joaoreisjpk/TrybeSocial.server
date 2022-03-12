import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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

      // return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new Error('Email já utilizado');
        }
      }
      throw err;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    return user;
    if (!user) throw new Error('Email ou Senha incorretos');

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) throw new Error('Email ou Senha incorretos');

    // return this.signToken(user.id, user.email);
  }

  async getAll() {
    return this.prisma.user.findMany();
  }

  /* async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15min',
      secret,
    });

    return { acess_token: token };
  } */
}
