# Prompt 02: Generar tests antes de implementar

Lee estos documentos antes de responder:

- `docs/specs/auth_service.md`
- `docs/specs/auth_contracts.md`
- `docs/specs/auth_acceptance_tests.md`
- `docs/specs/auth_architecture_rules.md`
- `docs/specs/system_instructions.md`

Tarea:

Genera los tests unitarios de la fachada y del controller usando Vitest.

Archivos permitidos:

- `tests/auth.facade.test.ts`
- `tests/auth.controller.test.ts`

Restricciones:

- No implementes todavía la fachada.
- No implementes todavía el controller.
- No modifiques contratos.
- Usa mocks para `IUserRepository`, `IPasswordHasher`, `ITokenService` y `IAuthFacade`.
- Los tests deben validar los casos de aceptación definidos en `auth_acceptance_tests.md`.

Objetivo de la demo:

Los tests deben nacer en rojo porque todavía no existe implementación.
