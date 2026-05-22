# architecture_rules.md

## 1. Propósito del documento

Este documento define las reglas arquitectónicas obligatorias del proyecto.

Su objetivo es impedir que la IA genere código por “sensaciones” y garantizar que cualquier implementación respete una arquitectura clara, predecible, testeable y mantenible.

La IA debe considerar este documento como una **fuente de verdad arquitectónica**. Si una petición del usuario contradice estas reglas, la IA debe advertirlo antes de generar código.

---

## 2. Principio rector

El proyecto se construye siguiendo una arquitectura por capas con patrón **Facade**.

La regla principal es:

```txt
El controller no ejecuta lógica de negocio.
El controller llama a la facade.
La facade orquesta el caso de uso.
Los services ejecutan operaciones internas.
Los repositories abstraen la persistencia.
```

Flujo obligatorio:

```txt
route -> controller -> facade -> service -> repository/model
```

No se permite saltarse capas.

---

## 3. Capas de la aplicación

### 3.1 Route

La capa `route` es responsable únicamente de definir endpoints HTTP.

Responsabilidades permitidas:

- Crear un `Router` de Express.
- Asociar rutas HTTP con métodos del controller.
- Aplicar middlewares específicos de ruta, si existen.
- Registrar endpoints del módulo.

Responsabilidades prohibidas:

- Ejecutar lógica de negocio.
- Validar reglas de dominio.
- Acceder a servicios directamente.
- Acceder a repositories directamente.
- Construir respuestas complejas.
- Hacer consultas a base de datos.

Ejemplo correcto:

```ts
router.post("/register", asyncHandler(controller.register));
```

Ejemplo incorrecto:

```ts
router.post("/register", async (req, res) => {
  const user = await db.users.create(req.body);
  res.json(user);
});
```

---

### 3.2 Controller

La capa `controller` adapta HTTP al caso de uso.

Responsabilidades permitidas:

- Leer datos de `req.body`, `req.params` y `req.query`.
- Invocar métodos de la facade.
- Convertir el resultado de la facade en respuesta HTTP.
- Decidir códigos HTTP en función del resultado recibido.
- Delegar errores al middleware correspondiente.

Responsabilidades prohibidas:

- Implementar reglas de negocio.
- Hashear contraseñas.
- Generar tokens.
- Consultar base de datos.
- Instanciar repositories dentro de los métodos.
- Saltarse la facade e invocar services directamente.
- Contener lógica condicional compleja de dominio.

El controller debe ser fino.

Regla de tamaño:

```txt
Un método de controller no debe superar 20 líneas salvo justificación explícita.
```

---

### 3.3 Facade

La capa `facade` es el punto de entrada de los casos de uso del módulo.

En este proyecto, la facade representa el límite principal entre la capa HTTP y la lógica interna del módulo.

Responsabilidades permitidas:

- Exponer métodos de alto nivel orientados a casos de uso.
- Orquestar services.
- Coordinar validaciones de aplicación.
- Coordinar repositorios indirectamente a través de services.
- Traducir errores internos en resultados de aplicación.
- Mantener una API interna clara para el controller.

Responsabilidades prohibidas:

- Depender de `Request` o `Response` de Express.
- Construir respuestas HTTP.
- Leer directamente variables de `req`.
- Contener SQL o acceso directo a base de datos.
- Mezclar detalles de infraestructura con reglas de negocio.
- Convertirse en una clase gigantesca con toda la lógica del sistema.

La facade debe hablar en términos de aplicación, no en términos HTTP.

Ejemplo conceptual correcto:

```ts
const result = await authFacade.registerUser(input);
```

Ejemplo incorrecto:

```ts
const result = await authFacade.registerUser(req, res);
```

---

### 3.4 Service

La capa `service` contiene operaciones internas necesarias para ejecutar casos de uso.

Responsabilidades permitidas:

- Implementar operaciones de aplicación.
- Encapsular lógica reutilizable.
- Aplicar reglas técnicas relacionadas con el caso de uso.
- Coordinar llamadas a repositories.
- Invocar servicios especializados como hashing, tokenización o validación cuando estén definidos por Specs posteriores.

Responsabilidades prohibidas:

- Conocer Express.
- Devolver respuestas HTTP.
- Leer `req` o escribir en `res`.
- Definir rutas.
- Decidir códigos HTTP.
- Mezclar lógica de varios módulos sin una dependencia explícita.

---

### 3.5 Repository

La capa `repository` abstrae la persistencia.

Responsabilidades permitidas:

- Leer datos.
- Guardar datos.
- Actualizar datos.
- Buscar entidades.
- Ocultar el mecanismo real de persistencia.
- Exponer métodos claros orientados al dominio o al caso de uso.

Responsabilidades prohibidas:

- Conocer Express.
- Devolver códigos HTTP.
- Implementar reglas de negocio.
- Hashear contraseñas.
- Generar tokens.
- Validar DTOs de entrada HTTP.
- Decidir flujos de aplicación.

En fase de bootstrap, los repositories pueden ser placeholders o implementaciones en memoria si una Spec lo autoriza.

---

### 3.6 Model

La capa `model` representa estructuras de datos internas.

Responsabilidades permitidas:

- Definir entidades.
- Definir modelos internos.
- Definir estructuras de persistencia.
- Representar datos usados por repositories y services.

Responsabilidades prohibidas:

- Ejecutar lógica HTTP.
- Instanciar Express.
- Crear rutas.
- Ejecutar side effects externos si no están definidos por Specs.

---

## 4. Regla de dependencia entre capas

Las dependencias deben ir siempre en esta dirección:

```txt
route -> controller -> facade -> service -> repository/model
```

Una capa puede depender de la capa inmediatamente inferior o de tipos compartidos.

No se permite:

```txt
repository -> service
repository -> facade
service -> controller
facade -> controller
controller -> repository
route -> service
route -> repository
```

---

## 5. Reglas sobre TypeScript

El proyecto debe usar TypeScript estricto.

Reglas obligatorias:

- No usar `any`, salvo justificación explícita.
- Preferir `unknown` cuando el tipo sea realmente desconocido.
- Definir tipos de entrada y salida para métodos públicos.
- No devolver objetos ambiguos desde casos de uso.
- No inventar tipos si ya existe un contrato en Specs.
- No duplicar tipos entre archivos.
- No silenciar errores del compilador con `// @ts-ignore`.

Regla sobre DTOs:

```txt
Los DTOs deben definirse en archivos de contrato o types del módulo.
No deben inventarse dentro de controllers o services.
```

---

## 6. Reglas sobre errores

Los errores deben tratarse de forma coherente.

Reglas:

- Los errores técnicos pueden representarse con `AppError`.
- Los errores esperados de negocio deben representarse como resultados controlados.
- El controller traduce resultados a HTTP.
- La facade no debe devolver directamente objetos `Response`.
- El repository no debe lanzar errores HTTP.

Ejemplo conceptual:

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
```

---

## 7. Reglas sobre testing

Todo comportamiento funcional debe poder probarse.

Reglas:

- No se implementa lógica funcional sin tests asociados.
- Los tests deben derivarse de las Specs.
- La IA no puede modificar tests para hacer que pasen.
- Si un test falla, la implementación debe ajustarse a la Spec.
- Los tests deben validar comportamiento, no detalles accidentales de implementación.

Orden preferente:

```txt
Spec -> contrato -> tests -> implementación
```

No:

```txt
prompt improvisado -> código -> test superficial
```

---

## 8. Reglas anti-VibeCoding

La IA tiene prohibido:

1. Generar código sin explicar qué Spec está cumpliendo.
2. Inventar reglas de negocio no documentadas.
3. Resolver ambigüedades tomando decisiones silenciosas.
4. Saltarse la facade.
5. Meter lógica de dominio en controllers.
6. Meter lógica HTTP en services o repositories.
7. Crear funciones largas y difíciles de revisar.
8. Duplicar lógica en varias capas.
9. Añadir dependencias sin justificación.
10. Reescribir la estructura del proyecto sin autorización.

Si falta información, debe responder:

```txt
No puedo implementar esto de forma rigurosa porque falta una decisión en la Spec: [decisión faltante].
```

---

## 9. Regla de diseño antes de implementación

Antes de implementar lógica funcional, la IA debe identificar:

- Qué Spec está aplicando.
- Qué contrato de entrada usa.
- Qué contrato de salida devuelve.
- Qué capa va a modificar.
- Qué capa no debe modificar.
- Qué tests deberían validar el cambio.

Para tareas no triviales, la IA debe proponer primero un breve plan técnico.

No debe empezar escribiendo código directamente.

---

## 10. Criterios para aceptar código generado por IA

El código generado se considera aceptable solo si:

- Respeta el flujo `route -> controller -> facade -> service -> repository/model`.
- Compila en TypeScript estricto.
- No contiene `any` injustificado.
- No duplica contratos.
- No introduce dependencias no solicitadas.
- No mezcla HTTP con dominio.
- No contiene lógica de negocio en rutas.
- No contiene lógica de negocio en controllers.
- Tiene tests si implementa comportamiento funcional.
- Se puede explicar contra una Spec concreta.

---

## 11. Criterios para rechazar código generado por IA

El código debe rechazarse si:

- “Parece que funciona” pero no está alineado con la Spec.
- Crea una solución genérica no pedida.
- Añade carpetas, servicios o librerías innecesarias.
- Mete todo el caso de uso en el controller.
- Omite la facade.
- Usa nombres bonitos pero responsabilidades confusas.
- Hace llamadas directas a base de datos desde HTTP.
- Modifica tests para que pasen.
- Resuelve reglas no especificadas inventando comportamiento.

---

## 12. Aplicación concreta al módulo `auth`

El módulo `auth` debe seguir siempre esta cadena:

```txt
auth.routes.ts
    -> auth.controller.ts
        -> auth.facade.ts
            -> auth.service.ts
                -> auth.repository.ts / auth.model.ts
```

### `auth.routes.ts`

Solo define rutas y enlaza controller.

### `auth.controller.ts`

Solo adapta HTTP y llama a la facade.

### `auth.facade.ts`

Orquesta casos de uso como:

```txt
registerUser
loginUser
refreshToken
```

Solo cuando esas operaciones estén definidas por Specs funcionales.

### `auth.service.ts`

Implementa operaciones internas requeridas por la facade.

### `auth.repository.ts`

Abstrae almacenamiento y búsqueda de usuarios.

### `auth.types.ts`

Contiene contratos internos del módulo cuando estén definidos por Specs.

### `auth.model.ts`

Contiene modelos internos o entidades del módulo.

---

## 13. Convenciones de nombres

Reglas:

- Clases en `PascalCase`.
- Funciones y métodos en `camelCase`.
- Archivos de módulo en formato `auth.facade.ts`, `auth.controller.ts`, etc.
- Métodos de facade orientados a casos de uso.
- Métodos de repository orientados a persistencia.

Ejemplos correctos:

```ts
AuthController
AuthFacade
AuthService
AuthRepository

registerUser()
findByEmail()
saveUser()
```

Ejemplos incorrectos:

```ts
doStuff()
handleThings()
processData()
authManager()
```

---

## 14. Regla de simplicidad para la demo

Este proyecto es una demo técnica.

Por tanto:

- El código debe ser claro antes que sofisticado.
- Se prefieren nombres explícitos.
- Se debe evitar sobreingeniería.
- Se debe evitar magia innecesaria.
- Se debe evitar abstracción prematura.
- Cada archivo debe poder explicarse en una charla en directo.

El objetivo no es demostrar complejidad, sino control.

---

## 15. Frase guía

La IA puede generar código rápido, pero este proyecto exige que genere código dentro de raíles.

La regla final es:

```txt
Si no está en la Spec, no se inventa.
Si no respeta las capas, no se acepta.
Si no se puede testear, no está terminado.
```