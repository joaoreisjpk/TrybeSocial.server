import argon from 'argon2';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import CryptoJS from 'crypto-js';

import AuthDto from './dto';
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
    const {
      email, password, firstName, lastName, trybe,
    } = dto;
    const hash = await argon.hash(password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          email,
          hash,
          firstName,
          lastName,
          trybe,
        },
      });

      const tokens = await this.getTokens(newUser.user_id, newUser.email);
      await this.updateRtHash(newUser.user_id, tokens.refreshToken);

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

    const tokens = await this.getTokens(user.user_id, user.email);
    await this.updateRtHash(user.user_id, tokens.refreshToken);

    return tokens;
  }

  async getAll() {
    return this.prisma.user.findMany();
  }

  async logout(email: string) {
    await this.prisma.user.update({
      where: {
        email,
      },
      data: { tokenRt: null },
    });
  }

  async refreshTokens(id: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: id,
      },
    });

    if (!user || !user.tokenRt) return { error: 'Accesso Negado' };

    const rtMatches = await argon.verify(user.tokenRt, rt);
    if (!rtMatches) return { error: 'Accesso Negado' };

    const tokens = await this.getTokens(user.user_id, user.email);

    await this.updateRtHash(user.user_id, tokens.refreshToken);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        tokenRt: hash,
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async getTokens(userId: number, email: string) {
    const payload = {
      userId,
      email,
    };

    const acessToken = jwt.sign(payload, '15min');

    const refreshToken = jwt.sign({ userId }, '3d');

    return {
      acessToken,
      refreshToken,
    };
  }
}