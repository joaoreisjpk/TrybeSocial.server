import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

export type payloadType = string | { userId: number; email: string };

export type RTPayload = { payload: string }

const secret = process.env.JWT_SECRET || '';

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
    return jwt.verify(token, this.secret) as payloadType | RTPayload;
  }

  decode(token: string) {
    return jwt.decode(token) as payloadType;
  }
}

// Encrypt
export const encrypt = (message: string) =>
  CryptoJS.AES.encrypt(message, secret).toString();

// Decrypt
export const decrypt = (message: string) => {
  const bytes = CryptoJS.AES.decrypt(message || '', secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// GetId
export const getTokenId = ({ payload }: RTPayload) => {
  const id = payload.match(/\d+/) as number[] | null;
  return id ? id[0] : 0;
}
