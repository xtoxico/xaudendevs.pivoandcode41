import { Request, Response } from 'express';
import { IAuthFacade } from './auth.contracts';
import { AuthError } from './auth.errors';

export class AuthController {
  constructor(private readonly authFacade: IAuthFacade) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authFacade.register({ email, password });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof AuthError) {
        const mappedCode = this.mapErrorCode(error.code);
        res.status(error.httpStatus).json({
          code: mappedCode,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        code: 'AUTH-500-UNEXPECTED',
        message: 'An unexpected error occurred',
      });
    }
  };

  private mapErrorCode(code: string): string {
    switch (code) {
      case 'INVALID_EMAIL':
        return 'AUTH-400-EMAIL';
      case 'INVALID_PASSWORD':
        return 'AUTH-400-PASSWORD';
      case 'EMAIL_ALREADY_EXISTS':
        return 'AUTH-409-DUPLICATE';
      default:
        return 'AUTH-500-UNEXPECTED';
    }
  }
}
