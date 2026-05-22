import { IUserRepository, UserEntity } from './auth.contracts';

export class UserRepository implements IUserRepository {
  private users: UserEntity[] = [];

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }

  async create(data: { email: string; passwordHash: string }): Promise<UserEntity> {
    const newUser: UserEntity = {
      id: Math.random().toString(36).substring(2, 11),
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }
}
