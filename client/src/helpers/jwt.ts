import jwt from 'jsonwebtoken';
import 'dotenv/config';

type payloadType = {
  userId: number;
  email: string;
};

export default class JWT {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET as string;
  }

  sign(payload: payloadType, expiresIn: string) {
    return jwt.sign(payload, this.secret, {
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
