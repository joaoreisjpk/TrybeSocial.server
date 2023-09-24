import { PrismaClient as PrismaClientType } from '@prisma/client';
import PrismaClient from '../prisma';

export default class AuthService {
  prisma: PrismaClientType;

  secret: string;

  constructor() {
    this.prisma = PrismaClient;
    this.secret = process.env.JWT_SECRET;
  }

  async getUser(req: any) {
    const id = req.params.userId;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return { error: 'User not found' };

    return {
      id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      trybe: user.trybe,
    };
  }

  async getAll() {
    return this.prisma.user.findMany();
  }

  async findUsers(email: string) {
    await this.prisma.user.update({
      where: {
        email,
      },
      data: { tokenRt: null },
    });
  }
}
