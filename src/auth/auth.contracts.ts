export interface RegisterUserInput {
  email: string;
  password: string;
}

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface RegisterUserSuccess {
  user: PublicUser;
  accessToken: string;
}

export interface IAuthFacade {
  register(input: RegisterUserInput): Promise<RegisterUserSuccess>;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: {
    email: string;
    passwordHash: string;
  }): Promise<UserEntity>;
}

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
}

export interface ITokenService {
  sign(payload: { sub: string; email: string }): Promise<string>;
}
