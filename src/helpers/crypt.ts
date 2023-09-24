import jwt from 'jsonwebtoken';
import 'dotenv/config';
import CryptoJS from 'crypto-js';

export default class JWToken {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET;
  }

  sign(email: string, expiresIn: string) {
    return jwt.sign({ email }, this.secret, {
      algorithm: 'HS256',
      expiresIn,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  decode(token: string) {
    return jwt.decode(token);
  }
}

export const decrypt = (message: string) => {
  const secret = process.env.JWT_SECRET.replace(/(\r\n|\n|\r)/gm, '');
  const bytes = CryptoJS.AES.decrypt(message, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};
