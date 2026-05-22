import { IPasswordHasher } from './auth.contracts';
import bcrypt from 'bcrypt';

export class PasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
