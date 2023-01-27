import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default class JWToken {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET;
  }

  sign(email: string, expiresIn: string) {
    return jwt.sign({email}, this.secret, {
      algorithm: 'HS256',
      expiresIn,
    });
  }

  verify(token: string) {
    return jwt.verify(token, this.secret);
  }

  // eslint-disable-next-line class-methods-use-this
  decode(token: string) {
    return jwt.decode(token);
  }
}
