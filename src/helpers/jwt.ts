import jwt from 'jsonwebtoken';
import 'dotenv/config';

type payloadType = { userId: number; email?: string };

export default class JWToken {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET;
  }

  sign(payload: payloadType, expiresIn: string) {
    const payloadValue = typeof payload === 'string' ? { payload } : payload;

    return jwt.sign(payloadValue, this.secret, {
      algorithm: 'HS256',
      expiresIn,
    });
  }

  verify(token: string) {
    return jwt.verify(token, this.secret);
  }

  decode(token: string) {
    return jwt.decode(token);
  }
}
