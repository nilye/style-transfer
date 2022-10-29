import { Service } from 'egg';
import jwt from 'jsonwebtoken';

export default class AuthService extends Service {

  signJwt(bucket: string, client: string) {
    const payload = {
      bucket,
      client,
    };
    return jwt.sign(payload, this.config.AUTH_SECRET, {
      expiresIn: '5y',
      issuer: 'nil.work',
      audience: 'style-transfer.nil.work',
    });
  }
}
