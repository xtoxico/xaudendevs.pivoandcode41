import {
  IAuthFacade,
  RegisterUserInput,
  RegisterUserSuccess,
  IUserRepository,
  IPasswordHasher,
  ITokenService,
} from './auth.contracts';
import { AuthError } from './auth.errors';

export class AuthFacade implements IAuthFacade {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  async register(input: RegisterUserInput): Promise<RegisterUserSuccess> {
    this.validateInput(input);

    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AuthError('EMAIL_ALREADY_EXISTS', 'Email is already registered', 409);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const userEntity = await this.userRepository.create({
      email: input.email,
      passwordHash,
    });

    const accessToken = await this.tokenService.sign({
      sub: userEntity.id,
      email: userEntity.email,
    });

    return {
      user: {
        id: userEntity.id,
        email: userEntity.email,
        createdAt: userEntity.createdAt.toISOString(),
      },
      accessToken,
    };
  }

  private validateInput(input: RegisterUserInput): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email || !emailRegex.test(input.email)) {
      throw new AuthError('INVALID_EMAIL', 'Invalid email format', 400);
    }
    if (!input.password || input.password.length < 8) {
      throw new AuthError('INVALID_PASSWORD', 'Password must be at least 8 characters long', 400);
    }
  }
}
