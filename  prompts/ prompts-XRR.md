# prompts-XRR.md

Agente automatico de cursor.

## Prompt para crear endpoints clave de candidatos LTI

Actúa como desarrollador backend experto en Node.js (Express), Prisma ORM y PostgreSQL.

Contexto:
Estoy trabajando en el proyecto LTI y necesito crear dos endpoints REST para manipular la lista de candidatos de una posición, usando los modelos de datos que siguen el ERD estándar de un sistema ATS.

Endpoints a implementar:

1. **GET /positions/:id/candidates**

   - Devuelve todos los candidatos en proceso para una posición (todas las applications para ese positionID).
   - Para cada candidato, incluye:
     - Nombre completo (concatenar firstName y lastName desde la tabla candidate).
     - current_interview_step (campo en application).
     - La puntuación media del candidato para esa posición (media de scores de sus interviews en esa application).

2. **PUT /candidates/:id/stage**
   - Actualiza la etapa (current_interview_step) de un candidato concreto.
   - Debe permitir modificar el campo adecuado de la aplicación correspondiente.

Requisitos:

- Utiliza Prisma para las consultas a base de datos.
- Implementa controladores y rutas siguiendo buenas prácticas.
- Incluye validación de parámetros y manejo básico de errores.
- Solo actualiza/crea los archivos necesarios en `/backend` para estos endpoints.
- Añade comentarios en el código donde haya decisiones importantes.

Si alguna relación del modelo requiere aclaración, coméntalo en el propio código.

Antes de proceder con la ejecución, dime dudas y sugerencias

---

## Respuesta Agente

¡Perfecto! Antes de implementar, te detallo mis dudas y sugerencias para asegurarme de que la solución se ajusta a tus expectativas y modelo de datos.

---

## Dudas sobre el modelo de datos

1. **Relación Application ↔ Candidate ↔ Position**

   - Asumo que existe una tabla `Application` que relaciona a un `Candidate` con un `Position` y contiene el campo `current_interview_step`.
   - ¿El campo `current_interview_step` está en `Application`? (Lo asumo por tu descripción, pero lo confirmo).

2. **Entrevistas y puntuaciones**

   - ¿La puntuación de un candidato para una posición se obtiene de la media de los `scores` de las entrevistas (`Interview`) asociadas a esa `Application`?
   - ¿El campo `score` está en la tabla `Interview`? ¿O hay una tabla intermedia para los resultados?

3. **Actualización de etapa**
   - Para el endpoint PUT `/candidates/:id/stage`, ¿el parámetro `id` es el de la tabla `Application` o el de la tabla `Candidate`?
     - Si es el de `Candidate`, ¿cómo identificamos la `Application` a actualizar (puede haber varias para un mismo candidato)?
     - Si es el de `Application`, sería más directo.

---

## Sugerencias

- **Validación**: Usaré validaciones básicas (existencia de IDs, tipos, etc.) y devolveré errores claros.
- **Estructura**: Crearé un controlador y rutas específicas para estos endpoints, siguiendo la estructura de `/backend/src/presentation/controllers` y `/backend/src/routes`.
- **Prisma**: Usaré Prisma para todas las consultas y actualizaciones.
- **Comentarios**: Añadiré comentarios donde haya supuestos o decisiones importantes.

---

## Resumen de lo que haré (si no hay objeciones):

1. **GET /positions/:id/candidates**

   - Buscar todas las `Application` para ese `positionId`.
   - Para cada una, obtener el `Candidate` (nombre completo), el `current_interview_step` y calcular la media de `score` de sus entrevistas.

2. **PUT /candidates/:id/stage**
   - (Según tu aclaración) Actualizar el campo `current_interview_step` de la `Application` correspondiente.
   - Si el `id` es de `Application`, lo actualizo directamente.
   - Si es de `Candidate`, necesitaré saber para qué posición o aplicación.

---

¿Me puedes aclarar estos puntos, especialmente el tema del identificador en el endpoint de actualización y la relación de las puntuaciones?  
¡Así me aseguro de que la implementación sea la correcta!

---

## Respuesta Usuario

### Dudas

1. **Relación Application ↔ Candidate ↔ Position**

   - Analiza tu mismo en el código si existe esta tabla

2. **Entrevistas y puntuaciones**

   - Si, pero revisa bien el código para ver como esta implementado actualmente.

3. **Actualización de etapa**
   - Es el id de Candidate, puedes ver las relaciones de las tablas en la definición de prisma @schema.prisma

### Sugerencias

Me parecen adecuadas todas las sugerencias.

Si tus dudas y sugerencias están resueltas, puedes proceder con la implementación

---

...varias iteraciones mas de correcciones
