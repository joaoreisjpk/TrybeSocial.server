import { PrismaClient as PrismaClientType } from '@prisma/client';
import PrismaClient from '../prisma';

export default class UserService {
  prisma: PrismaClientType;

  secret: string;

  constructor() {
    this.prisma = PrismaClient;
  }

  async listJobs() {
    return this.prisma.job.findMany();
  }

  async createJob(data: { title: string, description: string, link: string}) {
    return this.prisma.job.create({ data });
  }
}
