# Acceptance Tests Spec: Auth Service

## 1. Objetivo

Este documento define los tests que deben validar la demo.

Los tests deben derivarse de la Spec, no de una implementación concreta.

## 2. Tests de fachada

### TEST-F001: Registro correcto

Dado un email válido y una password válida, cuando se llama a `AuthFacade.register`, entonces:

- se comprueba que el email no existe;
- se hashea la password;
- se crea el usuario;
- se firma un token;
- se devuelve `user` y `accessToken`;
- no se devuelve `passwordHash`.

### TEST-F002: Email inválido

Dado un email inválido, cuando se llama a `AuthFacade.register`, entonces:

- se lanza `AuthError`;
- el código es `INVALID_EMAIL`;
- el estado HTTP asociado es `400`;
- no se llama al repositorio para crear usuario.

### TEST-F003: Password corta

Dada una password menor de 8 caracteres, cuando se llama a `AuthFacade.register`, entonces:

- se lanza `AuthError`;
- el código es `INVALID_PASSWORD`;
- el estado HTTP asociado es `400`.

### TEST-F004: Email duplicado

Dado un email que ya existe, cuando se llama a `AuthFacade.register`, entonces:

- se lanza `AuthError`;
- el código es `EMAIL_ALREADY_EXISTS`;
- el estado HTTP asociado es `409`;
- no se hashea la contraseña;
- no se crea un nuevo usuario.

## 3. Tests de controller

### TEST-C001: Registro correcto devuelve HTTP 201

Dado un body válido, cuando el controller llama a la fachada y recibe éxito, entonces responde con HTTP `201` y el cuerpo del resultado.

### TEST-C002: Error controlado devuelve status de dominio

Dado que la fachada lanza un `AuthError`, el controller responde con el `httpStatus` del error y un cuerpo controlado.

### TEST-C003: Error inesperado devuelve HTTP 500

Dado que la fachada lanza un error no controlado, el controller responde con HTTP `500` y no expone detalles internos.

## 4. Restricción de TDD

Una vez generada la suite de tests, queda prohibido modificar los tests para hacer que pasen.

La implementación debe adaptarse a los tests, no al revés.
