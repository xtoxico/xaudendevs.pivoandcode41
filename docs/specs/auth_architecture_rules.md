# Architecture Rules: TypeScript + Facade Pattern

## 1. Patrón elegido

La arquitectura obligatoria de esta demo es un patrón por capas con fachada:

```txt
routes/auth.routes.ts
  -> controllers/auth.controller.ts
    -> facades/auth.facade.ts
      -> models/user.repository.ts
      -> services/password-hasher.service.ts
      -> services/token.service.ts
```

## 2. Responsabilidad de cada capa

### Route

Responsabilidades:

- declarar rutas HTTP;
- conectar endpoint con método del controller;
- no contener lógica de negocio.

Prohibido:

- validar reglas de negocio;
- acceder a base de datos;
- hashear passwords;
- generar tokens.

### Controller

Responsabilidades:

- leer `req.body`;
- llamar a la fachada;
- transformar resultado en respuesta HTTP;
- capturar errores controlados.

Prohibido:

- decidir si un email está duplicado;
- ejecutar queries;
- usar bcrypt directamente;
- generar JWT directamente;
- contener lógica de negocio.

### Facade

Responsabilidades:

- coordinar el caso de uso completo;
- validar reglas de negocio;
- consultar repositorio;
- invocar hash de password;
- invocar generación de token;
- devolver un contrato limpio.

La fachada es el núcleo de la demo.

### Model / Repository

Responsabilidades:

- encapsular acceso a datos;
- implementar `IUserRepository`;
- traducir base de datos a `UserEntity`.

Prohibido:

- devolver respuestas HTTP;
- generar tokens;
- validar reglas de negocio del caso de uso.

### Services

Responsabilidades:

- encapsular dependencias externas concretas como bcrypt o JWT.

## 3. Regla de dependencias

Las dependencias solo pueden ir hacia abajo:

```txt
route -> controller -> facade -> repository/services
```

Nunca al revés.

## 4. Reglas estrictas para la IA

- Antes de generar código, debe indicar qué punto de la Spec está implementando.
- No debe crear archivos fuera de la estructura indicada salvo permiso explícito.
- No debe mezclar HTTP con reglas de negocio.
- No debe mezclar persistencia con controller.
- No debe modificar contratos sin pedir confirmación.
- Si falta un dato, debe preguntar antes de inventarlo.
- Si una función supera 25 líneas, debe proponer una refactorización.

## 5. Estructura de carpetas esperada

```txt
src/
  auth/
    auth.routes.ts
    auth.controller.ts
    auth.facade.ts
    auth.contracts.ts
    user.repository.ts
    password-hasher.service.ts
    token.service.ts
    auth.errors.ts
  app.ts
  server.ts

tests/
  auth.facade.test.ts
  auth.controller.test.ts
```

## 6. Resultado deseado

Código predecible, testeable y aburrido.

En software empresarial, que el código sea aburrido es una buena noticia.
