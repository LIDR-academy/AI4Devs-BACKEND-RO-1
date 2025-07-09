# Prompts Iniciales

## 1. Resumen del proyecto

> como experto en desarrollo web fullstack, dame un breve resumen del proyecto actual

## 2. Implementación de endpoints

> Eres un experto en desarrollo backend con enfoque en aplicaciones web fullstack. Ayúdame a implementar dos endpoints en una aplicación de reclutamiento con arquitectura MVC, teniendo en cuenta la estructura de la base de datos.
> 1. GET /positions/:id/candidates Este endpoint debe devolver todos los candidatos asociados a una posición específica (positionID). Para cada candidato, necesito:
> - Nombre completo (de la tabla candidates)
> - current_interview_step (de la tabla applications)
> - Puntuación media del candidato (promedio de los score de todas las entrevistas asociadas a su applicationID)
> Considera relaciones entre tablas como:
> - candidates tiene muchos applications
> - applications tiene muchas interviews
> 2. PUT /candidates/:id/stage Este endpoint debe permitir actualizar el campo current_interview_step de la tabla applications para un candidateID específico.
> Requisitos técnicos:
> - Usa controladores separados en /backend/controllers
> - Define las rutas en /backend/routes
> - Utiliza modelos ORM si están disponibles (por ejemplo, Sequelize o Mongoose)
> - Incluye validaciones básicas y manejo de errores
> - Asegúrate de que el código sea limpio, modular y fácil de testear
> El desarrollo lo debemos hacer paso a paso y no debes continuar hasta que yo te diga. Si tienes preguntas antes de empezar me las haces

## 3. Confirmación de stack y detalles

> 1 primsma
> 2 analiza la estructura de archivos de @README.md 
> 3 solo una por posición
> 4 si
> 5 existencia de la posición y candidato y el valor del nuevo stage
> 6 no

## 4. Lógica del endpoint PUT

> así estaría bien

## 5. Solicitud de explicación de lógica

> explicame la lógica primero

## 6. Solicitud de archivo de prompts

> necesito que crees un archivo llamdo prompts-iniciales.md dentro de la carpeta prompts del directorio raiz y que agregues los prompts utilizados en formato markdown 