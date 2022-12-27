import { PrismaClient } from '@prisma/client';

export default class UserService {
  prisma: PrismaClient;

  secret: string;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async listLabs() {
    return this.prisma.lab.findMany();
  }

  async createLab(data: { name: string, link: string}) {
    return this.prisma.lab.create({ data });
  }
}
