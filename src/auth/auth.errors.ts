export type AuthErrorCode =
  | 'INVALID_EMAIL'
  | 'INVALID_PASSWORD'
  | 'EMAIL_ALREADY_EXISTS'
  | 'UNEXPECTED_ERROR';

export class AuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
    public readonly httpStatus: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
