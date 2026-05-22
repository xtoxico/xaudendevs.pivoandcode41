import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from '../src/auth/auth.controller';
import { IAuthFacade } from '../src/auth/auth.contracts';
import { AuthError } from '../src/auth/auth.errors';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let authFacade: IAuthFacade;
  let controller: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    authFacade = {
      register: vi.fn(),
    };
    controller = new AuthController(authFacade);
    req = {
      body: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  describe('register', () => {
    it('should return 201 and user success data on successful registration (TEST-C001)', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const output = {
        user: {
          id: '123',
          email: 'test@example.com',
          createdAt: new Date().toISOString(),
        },
        accessToken: 'mock_token',
      };
      req.body = input;
      vi.mocked(authFacade.register).mockResolvedValue(output);

      await controller.register(req as Request, res as Response);

      expect(authFacade.register).toHaveBeenCalledWith(input);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(output);
    });

    it('should return the correct status and body for controlled AuthError (TEST-C002)', async () => {
      const input = { email: 'invalid', password: 'password123' };
      const authError = new AuthError('INVALID_EMAIL', 'Invalid email format', 400);
      req.body = input;
      vi.mocked(authFacade.register).mockRejectedValue(authError);

      await controller.register(req as Request, res as Response);

      expect(authFacade.register).toHaveBeenCalledWith(input);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 'AUTH-400-EMAIL',
        message: 'Invalid email format',
      });
    });

    it('should return 500 and not expose internal details for unexpected errors (TEST-C003)', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const unexpectedError = new Error('Database connection failed');
      req.body = input;
      vi.mocked(authFacade.register).mockRejectedValue(unexpectedError);

      await controller.register(req as Request, res as Response);

      expect(authFacade.register).toHaveBeenCalledWith(input);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 'AUTH-500-UNEXPECTED',
        message: 'An unexpected error occurred',
      });
    });
  });
});
