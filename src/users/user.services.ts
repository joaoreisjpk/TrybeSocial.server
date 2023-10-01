import PrismaClient from '../prisma';

export default class AuthService {
  static async getUser(req: any) {
    const id = req.params.userId;
    const user = await PrismaClient.user.findUnique({
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

  static async findUsers({ query: { email } }: any) {
    const users = await PrismaClient.user.findMany({ where: { email: { contains: email } } });
    return users;
  }
}
