import jwt from 'jsonwebtoken';

type payloadType = {
  userId: number;
  email: string;
};

export default class JWT {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET;
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
}
