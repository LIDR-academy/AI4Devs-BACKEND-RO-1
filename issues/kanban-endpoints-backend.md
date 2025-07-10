# Issue #001: Endpoints para Vista Kanban - Backend

## 📋 Resumen
**Título**: Implementar endpoints para gestión de candidatos en vista kanban  
**Prioridad**: Alta  
**Estimación**: 5-8 horas  
**Asignado a**: Backend Developer  
**Fecha de creación**: 2024-12-19  
**Estado**: 🟢 **Completado**

## 🎯 Descripción
Implementar dos nuevos endpoints que permitan manipular la lista de candidatos de una aplicación en una interfaz tipo kanban:

1. **GET /positions/:id/candidates** - Obtener candidatos por posición
2. **PUT /candidates/:id/stage** - Actualizar etapa de candidato

## 🔗 Especificación de Endpoints

### 📥 GET /positions/:id/candidates

**URL**: `GET /api/v1/positions/:positionId/candidates`

**Funcionalidad**: Obtiene todos los candidatos con aplicaciones activas para una posición específica.

**Parámetros**:
- `positionId` (number, required): ID de la posición
- `stage` (query, optional): Filtrar por etapa específica
- `limit` (query, optional): Límite de resultados (default: 50)
- `offset` (query, optional): Paginación (default: 0)

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "position": {
      "id": 1,
      "title": "Software Engineer",
      "company": "LTI"
    },
    "candidates": [
      {
        "applicationId": 1,
        "candidateId": 1,
        "fullName": "Juan Pérez García",
        "email": "juan.perez@email.com",
        "currentInterviewStep": {
          "id": 2,
          "name": "Technical Interview",
          "orderIndex": 2,
          "interviewType": "Technical Interview"
        },
        "averageScore": 8.5,
        "applicationDate": "2024-01-15T10:30:00Z",
        "interviewsCompleted": 2,
        "totalInterviews": 3,
        "lastUpdated": "2024-01-20T14:20:00Z"
      }
    ],
    "stages": [
      {
        "id": 1,
        "name": "Initial Screening",
        "orderIndex": 1,
        "candidateCount": 5
      }
    ],
    "totalCandidates": 8
  }
}
```

### 📤 PUT /candidates/:id/stage

**URL**: `PUT /api/v1/candidates/:candidateId/stage`

**Funcionalidad**: Actualiza la etapa actual del proceso de entrevista para un candidato específico.

**Parámetros**:
- `candidateId` (number, required): ID del candidato

**Body**:
```json
{
  "applicationId": 1,
  "newInterviewStepId": 3,
  "notes": "Candidato pasó la entrevista técnica exitosamente"
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "applicationId": 1,
    "candidateId": 1,
    "previousStep": {
      "id": 2,
      "name": "Technical Interview"
    },
    "currentStep": {
      "id": 3,
      "name": "Manager Interview"
    },
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

## 📁 Archivos a Modificar/Crear

### 🔧 Fase 1: Modelos y Servicios ✅
- [x] **backend/src/domain/models/Application.ts**
  - [x] Agregar método `getAverageScore(): Promise<number>`
  - [x] Agregar método `updateInterviewStep(newStepId: number): Promise<void>`

- [x] **backend/src/application/services/positionService.ts**
  - [x] Crear función `getCandidatesByPosition(positionId: number, filters?: any)`
  - [x] Implementar lógica de agregación de datos
  - [x] Implementar cálculo de puntuación media

- [x] **backend/src/application/services/candidateService.ts**
  - [x] Crear función `updateCandidateStage(candidateId, applicationId, newStepId, notes?)`
  - [x] Implementar validaciones de negocio
  - [x] Implementar actualización de timestamp

### 🎛️ Fase 2: Controladores y Rutas ✅
- [x] **backend/src/presentation/controllers/positionController.ts**
  - [x] Crear `getCandidatesByPositionController(req: Request, res: Response)`
  - [x] Implementar manejo de errores
  - [x] Implementar validación de parámetros

- [x] **backend/src/presentation/controllers/candidateController.ts**
  - [x] Crear `updateCandidateStageController(req: Request, res: Response)`
  - [x] Implementar manejo de errores
  - [x] Implementar validación de body

- [x] **backend/src/routes/positionRoutes.ts**
  - [x] Agregar ruta `router.get('/:id/candidates', getCandidatesByPositionController)`

- [x] **backend/src/routes/candidateRoutes.ts**
  - [x] Agregar ruta `router.put('/:id/stage', updateCandidateStageController)`

### ✅ Fase 3: Validadores ✅
- [x] **backend/src/application/validators/positionValidator.ts**
  - [x] Crear `validateGetCandidatesRequest(positionId: number, query: any)`
  - [x] Validar parámetros de paginación
  - [x] Validar filtros de etapa

- [x] **backend/src/application/validators/candidateValidator.ts**
  - [x] Crear `validateStageUpdateRequest(candidateId: number, body: any)`
  - [x] Validar que applicationId pertenece al candidato
  - [x] Validar que newInterviewStepId es válido

### 📝 Fase 4: Tipos e Interfaces ✅
- [x] **backend/src/types/position.ts**
  - [x] Crear interface `CandidatePositionData`
  - [x] Crear interface `StageInfo`
  - [x] Crear interface `CandidateFilters`

- [x] **backend/src/types/candidate.ts**
  - [x] Crear interface `StageUpdateRequest`
  - [x] Crear interface `StageUpdateResult`

## 🧪 Tests a Implementar

### ✅ Tests Unitarios ✅
- [x] **backend/tests/services/positionService.test.ts**
  - [x] Test: `should return candidates for valid position`
  - [x] Test: `should handle empty candidate list`
  - [x] Test: `should calculate average scores correctly`
  - [x] Test: `should filter by stage correctly`
  - [x] Test: `should handle pagination`

- [x] **backend/tests/services/candidateService.test.ts**
  - [x] Test: `should update stage successfully`
  - [x] Test: `should validate interview step belongs to position flow`
  - [x] Test: `should throw error for invalid stage`
  - [x] Test: `should save notes correctly`

- [x] **backend/tests/controllers/positionController.test.ts**
  - [x] Test controlador GET candidates
  - [x] Test manejo de errores
  - [x] Test validación de parámetros

- [x] **backend/tests/controllers/candidateController.test.ts**
  - [x] Test controlador PUT stage
  - [x] Test manejo de errores
  - [x] Test validación de body

### 🔗 Tests de Integración ✅
- [x] **backend/tests/integration/kanban-endpoints.test.ts**
  - [x] Test: `GET /positions/:id/candidates returns correct data`
  - [x] Test: `PUT /candidates/:id/stage updates database correctly`
  - [x] Test: `Error handling for invalid requests`
  - [x] Test: End-to-end workflow

## ✅ Criterios de Aceptación

### 📥 GET /positions/:id/candidates
- [ ] Responde con código 200 para posiciones existentes
- [ ] Retorna lista completa de candidatos con aplicaciones activas
- [ ] Calcula correctamente la puntuación media de entrevistas
- [ ] Incluye información completa del paso actual de cada candidato
- [ ] Maneja paginación con limit y offset
- [ ] Filtra por etapa cuando se especifica
- [ ] Responde con 404 si la posición no existe
- [ ] Responde con 400 para parámetros inválidos

### 📤 PUT /candidates/:id/stage
- [ ] Actualiza correctamente el currentInterviewStep en la tabla Application
- [ ] Valida que el nuevo paso pertenece al flujo de la posición
- [ ] Responde con 200 y datos actualizados en caso exitoso
- [ ] Responde con 404 si candidato o aplicación no existen
- [ ] Responde con 400 para datos inválidos
- [ ] Registra notes si se proporcionan
- [ ] Actualiza timestamp de última modificación

### 🛡️ Validaciones y Seguridad
- [ ] Validación de tipos de parámetros
- [ ] Validación de rangos para paginación
- [ ] Manejo apropiado de errores de base de datos
- [ ] Respuestas de error con mensajes descriptivos
- [ ] Sanitización de entrada para prevenir SQL injection
- [ ] Validación de permisos (preparado para futuro)

## 📚 Documentación a Actualizar

- [ ] **docs/api-reference.md**
  - [ ] Agregar sección "Gestión de Kanban"
  - [ ] Documentar ambos endpoints con ejemplos completos
  - [ ] Incluir códigos de error específicos

- [ ] **backend/api-spec.yaml**
  - [ ] Agregar definiciones completas de ambos endpoints
  - [ ] Incluir esquemas de request/response

## 🔒 Requisitos No Funcionales

### Rendimiento
- [ ] Tiempo de respuesta < 500ms para GET en condiciones normales
- [ ] Consultas optimizadas con JOINs eficientes
- [ ] Evitar N+1 queries
- [ ] Implementar paginación para listas grandes

### Seguridad
- [ ] Validación y sanitización de entrada
- [ ] Uso de parámetros preparados en consultas
- [ ] Headers de seguridad apropiados

### Escalabilidad
- [ ] Soportar hasta 1000 candidatos por posición
- [ ] Implementar headers de cache apropiados
- [ ] Manejo de concurrencia para actualizaciones

## 📊 Progreso General

**Backend Implementation**: 0% ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

### Estado por Fase:
- 🔴 **Fase 1 - Modelos y Servicios**: 0/8 tareas completadas
- 🔴 **Fase 2 - Controladores y Rutas**: 0/6 tareas completadas  
- 🔴 **Fase 3 - Validadores**: 0/6 tareas completadas
- 🔴 **Fase 4 - Tipos**: 0/6 tareas completadas
- 🔴 **Tests**: 0/12 tareas completadas
- 🔴 **Documentación**: 0/3 tareas completadas

## 📝 Notas de Implementación

### Consideraciones Importantes:
1. **Puntuación Media**: Debe excluir entrevistas sin score (null)
2. **Validación de Flujo**: Verificar que newInterviewStepId pertenece al flujo de la posición
3. **Casos Edge**: Manejar posiciones sin candidatos o candidatos sin entrevistas
4. **Logging**: Implementar logging detallado para actualizaciones de etapa
5. **Backward Compatibility**: Mantener compatibilidad con API existente

### Consultas SQL Principales:
```sql
-- Para GET candidates by position
SELECT 
  a.id as applicationId,
  c.id as candidateId,
  CONCAT(c.firstName, ' ', c.lastName) as fullName,
  c.email,
  is_current.name as currentStepName,
  AVG(i.score) as averageScore,
  COUNT(i.id) as interviewsCompleted
FROM Application a
JOIN Candidate c ON a.candidateId = c.id
JOIN InterviewStep is_current ON a.currentInterviewStep = is_current.id
LEFT JOIN Interview i ON a.id = i.applicationId AND i.score IS NOT NULL
WHERE a.positionId = ?
GROUP BY a.id, c.id, is_current.name;
```

## 🔄 Histórico de Cambios

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2024-12-19 | Creación del issue | System |

---

**Siguiente actualización**: Marcar checkboxes ✅ conforme se completen las tareas 