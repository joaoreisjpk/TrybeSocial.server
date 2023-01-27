import { PrismaClient as PrismaClientType } from '@prisma/client';
import PrismaClient from '../prisma';

export default class UserService {
  prisma: PrismaClientType;

  secret: string;

  constructor() {
    this.prisma = PrismaClient;
  }

  async listLabs() {
    return this.prisma.lab.findMany();
  }

  async createLab(data: { title: string, description: string, link: string}) {
    return this.prisma.lab.create({ data });
  }
}
