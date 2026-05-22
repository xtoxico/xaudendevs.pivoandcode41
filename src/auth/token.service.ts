import { ITokenService } from './auth.contracts';
import jwt from 'jsonwebtoken';

export class TokenService implements ITokenService {
  private readonly secret = process.env.JWT_SECRET || 'secret';

  async sign(payload: { sub: string; email: string }): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }
}
