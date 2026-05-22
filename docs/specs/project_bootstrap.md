# project_bootstrap.md

## 1. Propósito del documento

Este documento define la estructura base del proyecto que debe generarse antes de implementar cualquier lógica de negocio.

La finalidad de esta Spec es crear un proyecto **Node.js + Express + TypeScript** preparado para trabajar con IA de forma controlada, siguiendo una arquitectura por capas y usando el patrón **Facade** como punto de entrada a los casos de uso de cada módulo.

Esta Spec forma parte de una demo de desarrollo guiado por especificaciones. Por tanto, el objetivo no es construir toda la aplicación, sino preparar un terreno limpio, predecible y testeable sobre el que después se puedan aplicar Specs funcionales más concretas.

---

## 2. Alcance

Esta Spec cubre únicamente:

- Inicialización del proyecto Node.js.
- Configuración de TypeScript.
- Configuración de Express.
- Configuración de entorno mediante `.env`.
- Configuración de testing con Vitest y Supertest.
- Creación de la estructura inicial de carpetas.
- Creación del módulo `auth` como módulo vacío preparado para evolucionar.
- Creación de un endpoint técnico `/health`.

Esta Spec no cubre:

- Registro real de usuarios.
- Login.
- Hashing de contraseñas.
- Emisión de tokens.
- Persistencia real en base de datos.
- Validación funcional de DTOs.
- Reglas de negocio del módulo `auth`.
- Tests funcionales de autenticación.

---

## 3. Stack técnico obligatorio

El proyecto debe utilizar:

- Node.js.
- Express.
- TypeScript.
- Vitest.
- Supertest.
- dotenv.
- cors.
- tsx para ejecución en desarrollo.

No se deben añadir frameworks adicionales salvo que otra Spec posterior lo indique expresamente.

---

## 4. Patrón arquitectónico base

La aplicación debe organizarse por módulos y seguir este flujo:

```txt
route -> controller -> facade -> service -> repository/model
```

La responsabilidad de cada capa es la siguiente:

### Route

Define las rutas HTTP del módulo y conecta cada endpoint con su controller.

No debe contener lógica de negocio.

### Controller

Adapta la petición HTTP al caso de uso correspondiente.

Puede leer `req.body`, `req.params` o `req.query`.

No debe implementar reglas de negocio.

No debe acceder directamente a repositorios, modelos o servicios de infraestructura.

### Facade

Es el punto de entrada principal del módulo desde la capa HTTP.

Orquesta los casos de uso del módulo.

Agrupa operaciones de alto nivel.

Debe ocultar la complejidad interna del módulo al controller.

### Service

Contiene operaciones internas de aplicación o dominio necesarias para ejecutar casos de uso.

No debe conocer detalles HTTP.

### Repository / Model

Abstrae el acceso a datos.

En este bootstrap no debe conectarse todavía a una base de datos real.

Puede quedar como clase preparada para futura implementación.

---

## 5. Estructura obligatoria de carpetas

El proyecto debe generarse con esta estructura inicial:

```txt
.
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── vitest.config.ts
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── config
│   │   └── env.ts
│   ├── shared
│   │   ├── errors
│   │   │   └── AppError.ts
│   │   ├── http
│   │   │   └── asyncHandler.ts
│   │   └── types
│   │       └── Result.ts
│   └── modules
│       └── auth
│           ├── auth.routes.ts
│           ├── auth.controller.ts
│           ├── auth.facade.ts
│           ├── auth.types.ts
│           ├── auth.model.ts
│           ├── auth.repository.ts
│           └── auth.service.ts
└── tests
    └── health.test.ts
```

No se deben crear carpetas adicionales salvo que sean estrictamente necesarias para cumplir esta Spec.

---

## 6. Configuración de `package.json`

El archivo `package.json` debe incluir como mínimo los siguientes scripts:

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

### Dependencias de producción

Debe incluir:

```txt
express
dotenv
cors
```

### Dependencias de desarrollo

Debe incluir:

```txt
typescript
tsx
vitest
supertest
@types/node
@types/express
@types/cors
@types/supertest
```

---

## 7. Configuración de TypeScript

El archivo `tsconfig.json` debe:

- Activar modo estricto.
- Compilar desde `src`.
- Generar salida en `dist`.
- Usar módulos compatibles con Node.js.
- Permitir interoperabilidad con módulos CommonJS.
- Evitar emisión si existen errores de tipos.

Configuración esperada:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "noImplicitAny": true,
    "noEmitOnError": true
  },
  "include": ["src", "tests"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 8. Configuración de entorno

Debe existir un archivo `.env.example` con estas variables:

```env
NODE_ENV=development
PORT=3000
```

El archivo `src/config/env.ts` debe:

- Cargar `dotenv`.
- Exportar un objeto `env`.
- Normalizar `PORT` como número.
- Definir valores por defecto seguros.

Ejemplo conceptual:

```ts
export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000)
};
```

---

## 9. Configuración de Express

### `src/app.ts`

Debe:

- Crear la instancia de Express.
- Registrar `express.json()`.
- Registrar `cors()`.
- Exponer `GET /health`.
- Registrar las rutas de `auth` bajo `/api/auth`.
- Exportar `app`.

El endpoint `/health` debe responder:

```json
{
  "status": "ok"
}
```

### `src/server.ts`

Debe:

- Importar `app`.
- Importar `env`.
- Arrancar el servidor en `env.PORT`.
- Mostrar por consola el puerto de escucha.

---

## 10. Módulo `auth`

El módulo `auth` debe existir desde el bootstrap, pero sin lógica real de autenticación.

### `auth.routes.ts`

Debe:

- Crear un `Router`.
- Instanciar las dependencias mínimas del módulo.
- Registrar `POST /register`.
- Delegar en `AuthController.register`.

### `auth.controller.ts`

Debe:

- Exportar una clase `AuthController`.
- Recibir `AuthFacade` por constructor.
- Exponer un método `register`.
- En este bootstrap, `register` debe responder con estado `501`.

Respuesta sugerida:

```json
{
  "message": "Auth register not implemented yet"
}
```

### `auth.facade.ts`

Debe:

- Exportar una clase `AuthFacade`.
- Recibir `AuthService` por constructor.
- No implementar reglas de negocio.
- Servir como punto de entrada futuro para los casos de uso del módulo.

### `auth.service.ts`

Debe:

- Exportar una clase `AuthService`.
- Recibir `AuthRepository` por constructor.
- No implementar reglas de negocio.

### `auth.repository.ts`

Debe:

- Exportar una clase `AuthRepository`.
- No conectarse todavía a ninguna base de datos.
- Quedar preparado como abstracción futura de persistencia.

### `auth.model.ts`

Debe:

- Exportar una estructura mínima o placeholder para el futuro modelo de usuario.
- No definir todavía el modelo funcional definitivo salvo que otra Spec lo indique.

### `auth.types.ts`

Debe:

- Exportar tipos placeholder controlados.
- No inventar DTOs definitivos de registro o login.

---

## 11. Utilidades compartidas

### `src/shared/errors/AppError.ts`

Debe definir una clase `AppError` reutilizable para errores de aplicación.

Campos mínimos:

- `message`
- `statusCode`

### `src/shared/http/asyncHandler.ts`

Debe definir una utilidad para envolver handlers asíncronos de Express.

No debe contener lógica de negocio.

### `src/shared/types/Result.ts`

Debe definir un tipo genérico `Result<T>` para representar operaciones exitosas o fallidas.

Ejemplo conceptual:

```ts
export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
```

---

## 12. Testing mínimo

Debe existir `tests/health.test.ts`.

El test debe:

- Usar `vitest`.
- Usar `supertest`.
- Importar `app`.
- Validar que `GET /health` responde `200`.
- Validar que el cuerpo de respuesta es:

```json
{
  "status": "ok"
}
```

No se deben crear todavía tests de autenticación.

---

## 13. Restricciones explícitas para la IA

La IA que consuma esta Spec debe obedecer estas restricciones:

1. No implementar lógica de negocio.
2. No implementar registro real de usuarios.
3. No implementar login.
4. No añadir hashing.
5. No añadir JWT.
6. No añadir conexión a base de datos.
7. No añadir ORMs.
8. No generar DTOs definitivos.
9. No crear tests de autenticación.
10. No mezclar lógica HTTP con lógica de servicio.
11. No saltarse la capa Facade.
12. No modificar la arquitectura de carpetas sin justificarlo.
13. Si falta una decisión técnica, debe preguntar antes de inventarla.

---

## 14. Criterio de aceptación

El bootstrap se considera correcto cuando:

- El proyecto instala dependencias correctamente.
- `npm run dev` arranca el servidor.
- `GET /health` devuelve `{ "status": "ok" }`.
- `npm test` ejecuta correctamente el test de salud.
- `npm run build` compila sin errores.
- El módulo `auth` existe y está conectado bajo `/api/auth`.
- `POST /api/auth/register` existe pero devuelve `501`.
- No existe lógica funcional de autenticación todavía.
- La estructura respeta el patrón:

```txt
route -> controller -> facade -> service -> repository/model
```

---

## 15. Comandos esperados

La IA debe asumir que el proyecto se validará con estos comandos:

```bash
npm install
npm run dev
npm test
npm run build
```

---

## 16. Mensaje para siguientes Specs

Una vez completado este bootstrap, las siguientes Specs podrán definir:

- Contratos de entrada y salida.
- DTOs del módulo `auth`.
- Reglas de negocio.
- Casos de uso.
- Tests de aceptación.
- Implementación real de la fachada.
- Implementación de servicios.
- Implementación de persistencia.

Hasta que esas Specs existan, queda prohibido avanzar más allá del esqueleto inicial.
