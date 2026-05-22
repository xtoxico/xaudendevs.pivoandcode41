# Contracts Spec: Auth Service

## 1. Objetivo

Este documento define los contratos TypeScript que la IA debe respetar antes de generar lógica.

La implementación será inválida si cambia estos contratos sin autorización.

## 2. DTO de entrada

```ts
export interface RegisterUserInput {
  email: string;
  password: string;
}
```

## 3. Entidad interna de usuario

```ts
export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
```

## 4. Usuario público

```ts
export interface PublicUser {
  id: string;
  email: string;
  createdAt: string;
}
```

## 5. Respuesta de registro correcto

```ts
export interface RegisterUserSuccess {
  user: PublicUser;
  accessToken: string;
}
```

## 6. Errores de dominio/controlados

```ts
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
```

## 7. Contrato de la fachada

```ts
export interface IAuthFacade {
  register(input: RegisterUserInput): Promise<RegisterUserSuccess>;
}
```

## 8. Contrato del modelo/repositorio

```ts
export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: {
    email: string;
    passwordHash: string;
  }): Promise<UserEntity>;
}
```

## 9. Contrato del servicio de hash

```ts
export interface IPasswordHasher {
  hash(password: string): Promise<string>;
}
```

## 10. Contrato del servicio de tokens

```ts
export interface ITokenService {
  sign(payload: { sub: string; email: string }): Promise<string>;
}
```

## 11. Restricción de compatibilidad

Todo código generado debe importar estos contratos o reproducirlos exactamente si todavía no existen en el proyecto.
