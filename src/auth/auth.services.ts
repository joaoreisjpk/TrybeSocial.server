import argon from 'argon2';
import { PrismaClient as PrismaClientType, Prisma } from '@prisma/client';

import AuthDto from './dto';
import JWToken, { decrypt } from '../helpers/crypt';
import PrismaClient from '../prisma';
// Decrypt

const jwt = new JWToken();

export default class AuthService {
  prisma: PrismaClientType;

  secret: string;

  constructor() {
    this.prisma = PrismaClient;
    this.secret = process.env.JWT_SECRET;
  }

  async signup(dto: AuthDto) {
    const {
      email, password, firstName, lastName,
    } = dto;
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

      const accessToken = await this.getTokens(newUser.email);
      await this.updateRtHash(newUser.email, accessToken);

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          trybe: newUser.trybe,
          accessToken,
        },
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          return { error: 'Email já utilizado' };
        }
      }
      return { error: err };
    }
  }

  async signin({ email, password: encryptedPassword }: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return { error: 'Email ou Senha incorretos' };

    const isArgonVerified = await argon.verify(user.hash, decrypt(encryptedPassword));
    if (!isArgonVerified) return { error: 'Email ou Senha incorretos' };

    const accessToken = await this.getTokens(user.email);
    await this.updateRtHash(user.email, accessToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        trybe: user.trybe,
        accessToken,
      },
    };
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

  async updateUserAuth(email, currentAuthToken) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user?.tokenRt) throw new Error('updateUserAuth access denied');

    const isArgonVerified = await argon.verify(user.tokenRt, currentAuthToken);

    if (!isArgonVerified) throw new Error('updateUserAuth access denied');

    const accessToken = await this.getTokens(user.email);

    await this.updateRtHash(user.email, accessToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        trybe: user.trybe,
        accessToken,
      },
    };
  }

  async validateToken(rt: string) {
    const jwtt = jwt.decode(rt) as { email: string };
    if (!jwtt) return { error: 'validateToken access denied' };
    const user = await this.prisma.user.findUnique({
      where: {
        email: jwtt.email,
      },
    });

    if (!user || !user.tokenRt) return { error: 'validateToken access denied' };

    const isArgonVerified = await argon.verify(user.tokenRt, rt);
    if (!isArgonVerified) return { error: 'validateToken access denied' };

    return isArgonVerified ? {} : { error: 'validateToken access denied' };
  }

  async updateRtHash(email: string, rt: string) {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        tokenRt: hash,
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async getTokens(email: string) {
    const accessToken = jwt.sign(email, '7d');
    // const refreshToken = jwt.sign(email, '3d');

    return accessToken;
  }
}
