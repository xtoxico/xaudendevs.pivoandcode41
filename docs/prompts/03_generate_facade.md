# Prompt 03: Implementar la Facade

Lee estos documentos antes de responder:

- `docs/specs/auth_service.md`
- `docs/specs/auth_contracts.md`
- `docs/specs/auth_acceptance_tests.md`
- `docs/specs/auth_architecture_rules.md`
- `docs/specs/system_instructions.md`

Tarea:

Implementa únicamente la fachada del módulo de autenticación.

Archivos permitidos:

- `src/auth/auth.facade.ts`

Restricciones:

- La clase debe implementar `IAuthFacade`.
- La fachada debe recibir por constructor:
  - `IUserRepository`
  - `IPasswordHasher`
  - `ITokenService`
- No uses Express dentro de la fachada.
- No uses `req` ni `res`.
- No uses bcrypt directamente.
- No uses JWT directamente.
- No devuelvas `passwordHash`.
- No modifiques los tests.

Objetivo:

Escribe el código mínimo para hacer pasar los tests de `auth.facade.test.ts`. 
