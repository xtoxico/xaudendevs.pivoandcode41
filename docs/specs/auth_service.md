# Design Spec: Auth Service

## 1. Contexto

Este módulo implementa el registro de usuarios de una aplicación backend en **TypeScript + Express**.

La demo no busca construir una aplicación completa, sino demostrar cómo una IA puede generar código más predecible cuando trabaja contra una **Design Spec**, contratos claros y reglas de arquitectura.

## 2. Objetivo del módulo

Crear un servicio de registro que reciba un email y una contraseña, cree un usuario y devuelva una respuesta controlada con un token de acceso.

## 3. Caso de uso principal

### Registro de usuario

Como usuario no autenticado, quiero registrarme con email y contraseña para obtener una cuenta y un token de acceso.

### Flujo esperado

1. El cliente envía `email` y `password`.
2. El sistema valida el formato del email.
3. El sistema valida la política mínima de contraseña.
4. El sistema comprueba si el email ya existe.
5. Si el email no existe, se hashea la contraseña con bcrypt.
6. El sistema crea el usuario.
7. El sistema genera un token JWT.
8. El sistema devuelve una respuesta sin exponer el hash de contraseña.

## 4. Reglas de negocio

### AUTH-R001: Email obligatorio

El campo `email` es obligatorio y debe tener formato de email válido.

### AUTH-R002: Password obligatoria

El campo `password` es obligatorio.

### AUTH-R003: Longitud mínima de contraseña

La contraseña debe tener al menos 8 caracteres.

### AUTH-R004: Email único

No se puede registrar un usuario si ya existe otro usuario con el mismo email.

### AUTH-R005: Hash de contraseña

La contraseña nunca se almacena en texto plano. Debe almacenarse como `passwordHash` usando bcrypt.

### AUTH-R006: No exposición de datos sensibles

La respuesta pública nunca debe incluir `password`, `passwordHash` ni detalles internos de persistencia.

### AUTH-R007: Token tras registro correcto

Después de un registro correcto, se debe devolver un `accessToken` firmado con JWT.

## 5. Casos de error

| Código | Caso | Respuesta esperada |
| --- | --- | --- |
| AUTH-400-EMAIL | Email ausente o inválido | HTTP 400 |
| AUTH-400-PASSWORD | Password ausente o menor de 8 caracteres | HTTP 400 |
| AUTH-409-DUPLICATE | Email ya registrado | HTTP 409 |
| AUTH-500-UNEXPECTED | Error inesperado | HTTP 500 controlado |

## 6. Restricciones técnicas

- Lenguaje: TypeScript.
- Framework HTTP: Express.
- Patrón obligatorio: `route -> controller -> facade -> model/repository`.
- La lógica de negocio vive en la fachada.
- El controller solo traduce HTTP a llamada de fachada.
- El model/repository solo accede a datos.
- No se permite acceder a base de datos desde el controller.
- No se permite usar `req` o `res` dentro de la fachada.
- No se permite devolver entidades internas directamente al cliente.

## 7. Criterios de aceptación

La demo se considera correcta si:

- el registro válido crea usuario y devuelve token;
- un email duplicado devuelve conflicto;
- una contraseña corta devuelve error de validación;
- la respuesta no contiene `passwordHash`;
- la fachada se puede testear sin levantar Express;
- el controller se puede testear mockeando la fachada.
