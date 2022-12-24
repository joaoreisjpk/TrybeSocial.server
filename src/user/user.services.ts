import { PrismaClient } from '@prisma/client';

export default class UserService {
  prisma: PrismaClient;

  secret: string;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUser(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        turma: true,
      },
    });
  }
}
