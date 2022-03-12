import express from 'express';
import router from './routes';
import { PrismaClient } from '@prisma/client';

const app = express();

app.use(express.json());
app.use(router);

const prisma = new PrismaClient();

async function main() {
  const response = await prisma.user.findMany();
  console.log(response);
}

app.listen(3333, () => main());
