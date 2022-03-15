import argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import CryptoJS from 'crypto-js';
import JWToken from '../helpers/jwt';

const secret = process.env.JWT_SECRET || '';

// Decrypt
export const decrypt = (message: string) => {
  const bytes = CryptoJS.AES.decrypt(message || '', secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const jwt = new JWToken();

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

  async signin({ email, password: EncryptedPass }: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return { error: 'Email ou Senha incorretos' };

    const pwMatches = await argon.verify(user.hash, decrypt(EncryptedPass));
    if (!pwMatches) return { error: 'Email ou Senha incorretos' };

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async getAll() {
    return this.prisma.user.findMany();
  }

  // TODO
  async logout(email: string) {
    await this.prisma.user.update({
      where: {
        email: email,
      },
      data: { tokenRt: null },
    });
  }

  async refreshTokens(email: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !user.tokenRt) return { error: 'Accesso Negado' };

    const rtMatches = await argon.verify(user.tokenRt, rt);
    if (!rtMatches) return { error: 'Accesso Negado' };

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
      userId,
      email,
    };

    const acess_token = jwt.sign(payload, '15min');

    const refresh_token = jwt.sign(payload, '3d');

    return {
      acess_token,
      refresh_token,
    };
  }
}
