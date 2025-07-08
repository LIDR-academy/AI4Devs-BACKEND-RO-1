# UserStories.md - Historias de Usuario para Gestión de Candidatos Kanban

## Resumen Ejecutivo

Este documento define las historias de usuario y casos de uso para dos nuevos endpoints que permitirán la gestión de candidatos en una interfaz tipo kanban, facilitando el seguimiento del proceso de reclutamiento de manera visual e intuitiva.

## Contexto del Sistema

El sistema LTI Talent Tracking System maneja:
- **Posiciones**: Puestos de trabajo disponibles
- **Candidatos**: Personas que aplican a las posiciones
- **Aplicaciones**: Relación entre candidatos y posiciones
- **Entrevistas**: Evaluaciones realizadas a los candidatos
- **Flujos de Entrevista**: Procesos estructurados con pasos definidos
- **Puntuaciones**: Scores de las entrevistas realizadas

## Endpoint 1: GET /positions/:id/candidates

### Historia de Usuario Principal

**Como** un reclutador o hiring manager  
**Quiero** ver todos los candidatos en proceso para una posición específica  
**Para** poder gestionar el pipeline de reclutamiento de manera visual en un tablero kanban

### Criterios de Aceptación

- [ ] Debe retornar todos los candidatos que han aplicado a la posición especificada
- [ ] Debe incluir el nombre completo del candidato
- [ ] Debe mostrar la etapa actual del proceso de entrevista
- [ ] Debe calcular y mostrar la puntuación media del candidato
- [ ] Debe ordenar los candidatos por etapa del proceso
- [ ] Debe manejar posiciones que no existan (404)
- [ ] Debe manejar posiciones sin candidatos (array vacío)

### Casos de Uso

#### UC-1.1: Obtener Candidatos de una Posición Válida
**Actor**: Reclutador  
**Precondiciones**: 
- La posición existe en el sistema
- Existen aplicaciones para esa posición

**Flujo Principal**:
1. El reclutador solicita los candidatos de la posición ID=123
2. El sistema valida que la posición existe
3. El sistema busca todas las aplicaciones para esa posición
4. El sistema calcula la puntuación media de cada candidato
5. El sistema retorna la lista de candidatos con sus datos

**Resultado**: Lista de candidatos con nombre, etapa actual y puntuación media

#### UC-1.2: Obtener Candidatos de Posición sin Aplicaciones
**Actor**: Reclutador  
**Precondiciones**: 
- La posición existe en el sistema
- No existen aplicaciones para esa posición

**Flujo Principal**:
1. El reclutador solicita los candidatos de la posición ID=456
2. El sistema valida que la posición existe
3. El sistema no encuentra aplicaciones para esa posición
4. El sistema retorna un array vacío

**Resultado**: Array vacío []

#### UC-1.3: Obtener Candidatos de Posición Inexistente
**Actor**: Reclutador  
**Precondiciones**: 
- La posición no existe en el sistema

**Flujo Principal**:
1. El reclutador solicita los candidatos de la posición ID=999
2. El sistema valida que la posición no existe
3. El sistema retorna error 404

**Resultado**: Error 404 - Position not found

### Estructura de Respuesta

```json
{
  "positionId": 123,
  "positionTitle": "Software Engineer",
  "candidates": [
    {
      "candidateId": 1,
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "currentInterviewStep": {
        "id": 2,
        "name": "Technical Interview",
        "orderIndex": 2
      },
      "averageScore": 4.5,
      "totalInterviews": 3,
      "applicationDate": "2024-01-15T10:30:00Z"
    },
    {
      "candidateId": 2,
      "fullName": "Jane Smith",
      "email": "jane.smith@example.com",
      "currentInterviewStep": {
        "id": 1,
        "name": "Initial Screening",
        "orderIndex": 1
      },
      "averageScore": 0,
      "totalInterviews": 0,
      "applicationDate": "2024-01-20T14:15:00Z"
    }
  ]
}
```

## Endpoint 2: PUT /candidates/:id/stage

### Historia de Usuario Principal

**Como** un reclutador o hiring manager  
**Quiero** mover candidatos entre diferentes etapas del proceso de entrevista  
**Para** poder gestionar el progreso de los candidatos en el pipeline de reclutamiento

### Criterios de Aceptación

- [ ] Debe permitir actualizar la etapa actual de un candidato específico
- [ ] Debe validar que el candidato existe
- [ ] Debe validar que la nueva etapa es válida para el flujo de entrevista
- [ ] Debe actualizar la fecha de modificación de la aplicación
- [ ] Debe retornar la información actualizada del candidato
- [ ] Debe manejar candidatos que no existan (404)
- [ ] Debe manejar etapas inválidas (400)

### Casos de Uso

#### UC-2.1: Mover Candidato a Siguiente Etapa
**Actor**: Reclutador  
**Precondiciones**: 
- El candidato existe en el sistema
- El candidato tiene una aplicación activa
- La nueva etapa es válida en el flujo de entrevista

**Flujo Principal**:
1. El reclutador selecciona el candidato ID=1
2. El reclutador arrastra el candidato a la etapa "Technical Interview"
3. El sistema valida que el candidato existe
4. El sistema valida que la nueva etapa es válida
5. El sistema actualiza la etapa del candidato
6. El sistema retorna la información actualizada

**Resultado**: Candidato movido exitosamente a la nueva etapa

#### UC-2.2: Mover Candidato a Etapa Inválida
**Actor**: Reclutador  
**Precondiciones**: 
- El candidato existe en el sistema
- La nueva etapa no es válida para el flujo de entrevista

**Flujo Principal**:
1. El reclutador intenta mover el candidato ID=1 a una etapa inválida
2. El sistema valida que el candidato existe
3. El sistema valida que la nueva etapa no es válida
4. El sistema retorna error 400

**Resultado**: Error 400 - Invalid interview stage

#### UC-2.3: Mover Candidato Inexistente
**Actor**: Reclutador  
**Precondiciones**: 
- El candidato no existe en el sistema

**Flujo Principal**:
1. El reclutador intenta mover el candidato ID=999
2. El sistema valida que el candidato no existe
3. El sistema retorna error 404

**Resultado**: Error 404 - Candidate not found

#### UC-2.4: Mover Candidato sin Aplicación Activa
**Actor**: Reclutador  
**Precondiciones**: 
- El candidato existe en el sistema
- El candidato no tiene aplicaciones activas

**Flujo Principal**:
1. El reclutador intenta mover el candidato ID=3
2. El sistema valida que el candidato existe
3. El sistema verifica que no tiene aplicaciones activas
4. El sistema retorna error 400

**Resultado**: Error 400 - No active application found

### Estructura de Request

```json
{
  "interviewStepId": 2,
  "notes": "Candidato aprobado para siguiente fase"
}
```

### Estructura de Respuesta

```json
{
  "candidateId": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "updatedInterviewStep": {
    "id": 2,
    "name": "Technical Interview",
    "orderIndex": 2
  },
  "previousInterviewStep": {
    "id": 1,
    "name": "Initial Screening",
    "orderIndex": 1
  },
  "updatedAt": "2024-01-25T15:30:00Z",
  "notes": "Candidato aprobado para siguiente fase"
}
```

## Reglas de Negocio

### RN-1: Cálculo de Puntuación Media
- La puntuación media se calcula como el promedio de todos los scores de las entrevistas realizadas
- Si no hay entrevistas realizadas, la puntuación media es 0
- Solo se consideran entrevistas con score válido (no null)

### RN-2: Validación de Etapas
- Solo se pueden mover candidatos a etapas que pertenezcan al flujo de entrevista de la posición
- No se puede mover un candidato a una etapa anterior en el flujo (solo hacia adelante)
- Se puede mover un candidato a la misma etapa (sin cambios)

### RN-3: Orden de Etapas
- Las etapas se ordenan por el campo `orderIndex` del modelo `InterviewStep`
- La etapa con menor `orderIndex` es la primera del proceso
- La etapa con mayor `orderIndex` es la última del proceso

### RN-4: Estados de Aplicación
- Solo se pueden mover candidatos con aplicaciones activas
- Una aplicación se considera activa si no ha sido rechazada o completada
- El estado de la aplicación se mantiene independiente de la etapa

## Consideraciones Técnicas

### Performance
- Implementar paginación para posiciones con muchos candidatos
- Usar índices en la base de datos para optimizar consultas
- Cachear resultados de puntuaciones medias

### Seguridad
- Validar permisos del usuario para acceder a la posición
- Sanitizar inputs de notas y comentarios
- Logging de cambios de etapa para auditoría

### Validaciones
- Validar formato de IDs (números enteros positivos)
- Validar que las etapas pertenezcan al flujo correcto
- Validar longitud máxima de notas (ej: 500 caracteres)

## Métricas y Monitoreo

### Métricas a Capturar
- Tiempo promedio en cada etapa
- Tasa de conversión entre etapas
- Número de movimientos por candidato
- Tiempo total del proceso de reclutamiento

### KPIs Sugeridos
- Tiempo promedio desde aplicación hasta contratación
- Tasa de abandono por etapa
- Eficiencia del proceso de entrevista
- Satisfacción de los candidatos

## Próximos Pasos

1. **Implementación de Endpoints**: Desarrollo de los endpoints según las especificaciones
2. **Testing**: Creación de tests unitarios y de integración
3. **Documentación API**: Actualización de la documentación OpenAPI
4. **Frontend Integration**: Desarrollo de la interfaz kanban
5. **Validación de Usuario**: Testing con usuarios reales
6. **Optimización**: Mejoras basadas en feedback y métricas 