import { PrismaClient as PrismaClientType } from '@prisma/client';
import PrismaClient from '../prisma';

export interface ILab {
  title: string
  description: string
  repositoryLink: string
  contactLink: string
  contactNumber: string
}

export default class UserService {
  prisma: PrismaClientType;

  secret: string;

  constructor() {
    this.prisma = PrismaClient;
  }

  async listLabs() {
    return this.prisma.lab.findMany();
  }

  async createLab(data: ILab) {
    return this.prisma.lab.create({ data });
  }
}
