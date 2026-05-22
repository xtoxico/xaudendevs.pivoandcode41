# Prompt 05: Revisión contra la Spec

Lee estos documentos:

- `docs/specs/auth_service.md`
- `docs/specs/auth_contracts.md`
- `docs/specs/auth_acceptance_tests.md`
- `docs/specs/auth_architecture_rules.md`
- `docs/specs/system_instructions.md`

Tarea:

Revisa el código generado y devuelve una tabla con:

| Regla | Cumple | Evidencia | Corrección propuesta |
| --- | --- | --- | --- |

Debes comprobar:

- que el controller no tiene lógica de negocio;
- que la fachada coordina el caso de uso;
- que el repository no conoce HTTP;
- que no se expone `passwordHash`;
- que los tests cubren casos felices y errores;
- que no hay decisiones inventadas fuera de la Spec.

No generes código nuevo salvo que detectes incumplimientos concretos.
