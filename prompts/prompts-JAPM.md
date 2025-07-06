# Implementación de requerimientos
1. ¿me puedes dar los detalles del proyecto actual?
2. ¿el proyecto tiene unidad de test?
3. ¿De que manera podemos iniciar la ejecución del backend?
4. Dame una lista de instrucciones para iniciar la ejecución del backen en modo desarrollo, considera que no tengo ningun contenedor de docker en ejecución, por lo que no hay una base de datos activa. Incluye los comandos a ejecutar de ser necesario. ¿Tienes alguna pregunta antes de comenzar?

## Prompt 5
Implementa un endpoint en un proyecto Node.js con TypeScript, Express y Prisma para el siguiente requerimiento:

# Endpoint:
GET /positions/:id/candidates

# Funcionalidad:
Devuelve todas las aplicaciones (applications) para una posición específica (positionId). Para cada aplicación, la respuesta debe incluir:

- El nombre completo del candidato (concatenar firstName y lastName de la tabla Candidate)
- El id del paso actual de entrevista (current_interview_step, campo currentInterviewStep de la tabla Application)
- El id de la aplicación (id de la tabla Application)
- La puntuación media del candidato, calculada usando todas las entrevistas (Interview) asociadas a ese candidato (no solo de esa aplicación), usando el campo score (ignorar entrevistas sin score)

# Respuesta esperada (ejemplo):
```json
[
  {
    "applicationId": 1,
    "fullName": "Juan Pérez",
    "currentInterviewStep": 3,
    "averageScore": 7.5
  },
  ...
]
```
# Notas técnicas:
- Utiliza Prisma Client para las consultas.
- El endpoint debe estar en Express.
- Si un candidato no tiene entrevistas con score, averageScore debe ser null.
- No es necesario paginar ni filtrar más allá del positionId.

# Estructura sugerida:
- Crea el handler para el endpoint en un archivo de rutas Express.
- Utiliza Prisma para obtener las aplicaciones de la posición, incluyendo los datos del candidato y calculando la media de scores de todas sus entrevistas.

# Pautas para generar el contenido
- Genera una lista de pasos para realizar la implementación
- En cada paso de la lista menciona el archivo que se va a crear o modificar e incluye el código que se va agregar

Antes de realizar la tarea revisa mis requerimientos ¿hay algo que me este faltando considerar?
Hazme preguntas si necesitas más información.

6. Antes de realizar las pruebas unitaras ayudame a probar manualmente el endpoint implementado ¿como lo hariamos?
7. Al realizar la petición "curl http://localhost:3010/positions/1/candidates" obtengo el siguiente error: <detalles del error> ¿como lo arreglamos?

## Prompt 8
Implementa pruebas unitarias usando Jest para el endpoint GET /positions/:id/candidates definido en el controlador #file:positionController.ts 
# Requisitos:

- Mockea Prisma Client y los objetos Request/Response de Express.
- Ubica el archivo de pruebas en la carpeta __tests__ en la raíz de la carpeta backend.
- Cubre los siguientes casos:
- Cuando existen aplicaciones para la posición, devuelve correctamente el array con los datos esperados (incluyendo el promedio de score).
- Cuando no existen aplicaciones para la posición, devuelve un status 404 y el mensaje correspondiente.
- Cuando el id de la posición no es válido (no numérico), devuelve un status 400 y el mensaje correspondiente.
- Cuando existen aplicaciones pero el candidato no tiene entrevistas con score, el campo averageScore debe ser null.

# Notas técnicas:

- Mockea los métodos de Prisma (findMany) para devolver datos de prueba.
- Mockea los métodos de Express (req, res) usando spies o funciones simuladas.
- No es necesario levantar el servidor ni hacer peticiones HTTP reales.
- Usa TypeScript en el archivo de pruebas.

# Ejemplo de estructura esperada del archivo de pruebas:
```typescript
import { getCandidatesByPosition } from '../src/presentation/controllers/positionController';
// ... mocks y tests aquí ...
```

# Pautas para generar el contenido
- Genera una lista de pasos para realizar la implementación
- Cada paso se va ejecutar de manera individual por lo que me tienes que preguntar si podemos pasar al siguiente
- En cada paso de la lista menciona el archivo que se va a crear o modificar e incluye el código que se va agregar

Antes de realizar la tarea revisa mis requisitos ¿hay algo que me este faltando considerar?
Hazme preguntas si necesitas más información.

9. Ayudame a ejecutar las pruebas



# Refinación de prompts

# Prompt 1
Eres un experto en TypeScript, NodeJS, Express, Prisma y PostgreSQL.
# Contexto inicial
Tenemos una aplicación para gestionar candidatos y nos piden implementar nuevos endpoints en el backend pidiendos los siguiente: "Tu misión en este ejercicio es crear dos nuevos endpoints que nos permitirán manipular la lista de candidatos de una aplicación en una interfaz tipo kanban."

# Instrucciones Generales
El objetivo es crear un prompt para Copilot (CahtGPT 4.1) que implemente el siguiente requerimiento

# Requerimientos
"GET /positions/:id/candidates

Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

- Nombre completo del candidato (de la tabla candidate). current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
- La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score"

Antes de generar el prompt ¿tienes alguna pregunta?

## Prompt 2

Eres un experto en TypeScript, NodeJS, Express, Prisma y PostgreSQL.

# Contexto inicial
Tenemos una aplicación para gestionar candidatos y nos piden implementar nuevos endpoints en el backend pidiendos los siguiente: "Tu misión en este ejercicio es crear dos nuevos endpoints que nos permitirán manipular la lista de candidatos de una aplicación en una interfaz tipo kanban."

# Instrucciones Generales
El objetivo es crear un prompt para Copilot (CahtGPT 4.1) que implemente el siguiente requerimiento

# Requerimientos
"GET /positions/:id/candidates

Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

Nombre completo del candidato (de la tabla candidate). current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score"

Antes de generar el prompt ¿tienes alguna pregunta?

## Prompt 3
# Contexto inicial
Queremos implementar pruebas unitarias para el endpoint "GET /positions/:id/candidates"

# Instrucciones Generales
El objetivo es crear un prompt para Copilot (ChatGPT 4.1) que implemente las pruebas unitarias.

Antes de generar el prompt ¿tienes alguna pregunta?

## Prompt 4
Eres un experto en TypeScript, NodeJS, Express, Prisma y PostgreSQL.

# Contexto inicial
Tenemos una aplicación para gestionar candidatos y nos piden implementar nuevos endpoints en el backend pidiendos los siguiente: "Tu misión en este ejercicio es crear dos nuevos endpoints que nos permitirán manipular la lista de candidatos de una aplicación en una interfaz tipo kanban."

# Instrucciones Generales
El objetivo es crear un prompt para Copilot (CahtGPT 4.1) que implemente el siguiente requerimiento

# Requerimientos
"PUT /candidates/:id/stage

Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico."
Antes de generar el prompt ¿tienes alguna pregunta?

## Prompt 5
# Contexto inicial
Queremos implementar pruebas unitarias para el endpoint "PUT /candidates/:id/stage"

# Instrucciones Generales
El objetivo es crear un prompt para Copilot (CahtGPT 4.1) que implemente las pruebas unitarias.

Antes de generar el prompt ¿tienes alguna pregunta?

## Prompt 6
Eres un experto en documentación de APIs en formato YAML, así como en generación de Prompts

# Contexto inicial
Tenemos una aplicación para gestionar candidatos y nos piden implementar nuevos endpoints en el backend pidiendos los siguiente: "Tu misión en este ejercicio es crear dos nuevos endpoints que nos permitirán manipular la lista de candidatos de una aplicación en una interfaz tipo kanban."
Los endpoints de los metodos "GET /positions/:id/candidates" y "PUT /candidates/:id/stage" ya estan implementados, lo que requerimos ahora es actualizar la documentación.

# Instrucciones Generales
El objetivo es crear un prompt para Copilot (CahtGPT 4.1) que actualice la documentación de archivo #file:api-spec.yaml

Antes de generar el prompt ¿hay algo que me este faltando considerar?
Hazme preguntas si necesitas más información.

# Ejecución de seed.ts

1. Vamos a generar datos de prueba para el proyecto, los necesitamos para probar un endpoint ¿que necesitmos realizar para ejecutar #file:seed.ts?
Considera que ya tengo una base de datos en ejecución y lista para ser consumida.