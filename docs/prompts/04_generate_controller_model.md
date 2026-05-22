# Prompt 04: Implementar Controller, Repository y Services

Lee estos documentos antes de responder:

- `docs/specs/auth_service.md`
- `docs/specs/auth_contracts.md`
- `docs/specs/auth_architecture_rules.md`
- `docs/specs/system_instructions.md`

Tarea:

Implementa las piezas restantes del módulo respetando el patrón Facade.

Archivos permitidos:

- `src/auth/auth.controller.ts`
- `src/auth/auth.routes.ts`
- `src/auth/user.repository.ts`
- `src/auth/password-hasher.service.ts`
- `src/auth/token.service.ts`

Restricciones:

- El controller solo puede llamar a `IAuthFacade.register`.
- El controller no puede contener reglas de negocio.
- El repository implementa `IUserRepository`.
- `password-hasher.service.ts` encapsula bcrypt.
- `token.service.ts` encapsula JWT.
- No modifiques la fachada salvo que sea imprescindible y lo justifiques.
- No modifiques los tests.

Objetivo:

Completar la integración manteniendo separación estricta de responsabilidades.
