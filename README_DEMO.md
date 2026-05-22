# Demo PIVO&CODE 41: TypeScript + Facade Pattern + IA con raíles

Esta carpeta contiene los documentos Markdown necesarios para realizar la demo de la charla **Prompting Riguroso: por qué tu IA necesita un Arquitecto, no un entusiasta**.

La demo muestra cómo pasar de una especificación de diseño a código TypeScript predecible usando un patrón de capas sencillo:

```txt
route -> controller -> facade -> model/repository -> database/external services
```

El caso práctico será un **servicio de registro de usuarios** con:

- validación de entrada;
- email único;
- hash de contraseña con bcrypt;
- generación de token JWT;
- separación estricta entre controlador, fachada y modelo;
- tests como mecanismo de validación.

## Orden recomendado para la demo

1. Abrir `docs/specs/auth_service.md` y explicar que la IA no empieza desde un prompt vacío.
2. Abrir `docs/specs/auth_contracts.md` y mostrar que primero se definen tipos, DTOs y respuestas.
3. Abrir `docs/specs/auth_architecture_rules.md` y explicar las reglas del patrón `facade`.
4. Usar `docs/prompts/01_generate_contracts.md` para pedir a la IA que genere solo contratos TypeScript.
5. Usar `docs/prompts/02_generate_tests.md` para pedir tests antes de la implementación.
6. Usar `docs/prompts/03_generate_facade.md` para implementar la fachada.
7. Usar `docs/prompts/04_generate_controller_model.md` para implementar controller y model.
8. Ejecutar tests y mostrar el resultado.

## Mensaje clave

La IA no decide la arquitectura. La IA ejecuta sobre una arquitectura previamente definida.
