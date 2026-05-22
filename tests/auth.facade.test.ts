import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthFacade } from '../src/auth/auth.facade';
import { IUserRepository, IPasswordHasher, ITokenService } from '../src/auth/auth.contracts';
import { AuthError } from '../src/auth/auth.errors';

describe('AuthFacade', () => {
  let userRepository: IUserRepository;
  let passwordHasher: IPasswordHasher;
  let tokenService: ITokenService;
  let facade: AuthFacade;

  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };
    passwordHasher = {
      hash: vi.fn(),
    };
    tokenService = {
      sign: vi.fn(),
    };
    facade = new AuthFacade(userRepository, passwordHasher, tokenService);
  });

  describe('register', () => {
    it('should successfully register a user and return public user info and token (TEST-F001)', async () => {
      const email = 'user@example.com';
      const password = 'password123';
      const passwordHash = 'hashed_password';
      const token = 'jwt_token';
      const createdUser = {
        id: 'user-id-123',
        email,
        passwordHash,
        createdAt: new Date('2026-05-22T17:30:00.000Z'),
      };

      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(passwordHasher.hash).mockResolvedValue(passwordHash);
      vi.mocked(userRepository.create).mockResolvedValue(createdUser);
      vi.mocked(tokenService.sign).mockResolvedValue(token);

      const result = await facade.register({ email, password });

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(passwordHasher.hash).toHaveBeenCalledWith(password);
      expect(userRepository.create).toHaveBeenCalledWith({ email, passwordHash });
      expect(tokenService.sign).toHaveBeenCalledWith({ sub: createdUser.id, email });

      expect(result).toEqual({
        user: {
          id: createdUser.id,
          email: createdUser.email,
          createdAt: createdUser.createdAt.toISOString(),
        },
        accessToken: token,
      });
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should throw AuthError INVALID_EMAIL when email format is invalid (TEST-F002)', async () => {
      const invalidEmails = ['invalid-email', 'user@', '@domain.com', ''];

      for (const email of invalidEmails) {
        try {
          await facade.register({ email, password: 'password123' });
          expect.fail('Should have thrown AuthError');
        } catch (error: any) {
          expect(error).toBeInstanceOf(AuthError);
          expect(error.code).toBe('INVALID_EMAIL');
          expect(error.httpStatus).toBe(400);
        }
      }

      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw AuthError INVALID_PASSWORD when password is less than 8 characters (TEST-F003)', async () => {
      const shortPasswords = ['short', '1234567', ''];

      for (const password of shortPasswords) {
        try {
          await facade.register({ email: 'user@example.com', password });
          expect.fail('Should have thrown AuthError');
        } catch (error: any) {
          expect(error).toBeInstanceOf(AuthError);
          expect(error.code).toBe('INVALID_PASSWORD');
          expect(error.httpStatus).toBe(400);
        }
      }
    });

    it('should throw AuthError EMAIL_ALREADY_EXISTS and not hash or create user if email exists (TEST-F004)', async () => {
      const email = 'existing@example.com';
      const existingUser = {
        id: 'user-id-existing',
        email,
        passwordHash: 'some_hash',
        createdAt: new Date(),
      };

      vi.mocked(userRepository.findByEmail).mockResolvedValue(existingUser);

      try {
        await facade.register({ email, password: 'password123' });
        expect.fail('Should have thrown AuthError');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AuthError);
        expect(error.code).toBe('EMAIL_ALREADY_EXISTS');
        expect(error.httpStatus).toBe(409);
      }

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(passwordHasher.hash).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });
});
