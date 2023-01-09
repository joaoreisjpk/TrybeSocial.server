import { PrismaClient } from '@prisma/client';

export default class UserService {
  prisma: PrismaClient;

  secret: string;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async listJobs() {
    return this.prisma.job.findMany();
  }

  async createJob(data: { name: string, link: string}) {
    return this.prisma.job.create({ data });
  }
}
