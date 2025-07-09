# Endpoint Tests

Este documento describe cómo probar los endpoints principales del backend relacionados con posiciones y candidatos.

---

## 1. Obtener candidatos de una posición

**Endpoint:** `GET /positions/:id/candidates`

### Descripción
Devuelve todos los candidatos para una posición específica, incluyendo:
- Nombre completo
- current_interview_step
- Promedio de score de entrevistas

### Ejemplo de request
```bash
curl -X GET http://localhost:3010/positions/1/candidates
```

### Ejemplo de response
```json
[
  {
    "fullName": "John Doe",
    "currentInterviewStep": 2,
    "averageInterviewScore": 5
  },
  {
    "fullName": "Jane Smith",
    "currentInterviewStep": 2,
    "averageInterviewScore": 4.5
  }
]
```

### Casos de prueba
- [ ] Posición con candidatos
- [ ] Posición sin candidatos
- [ ] ID de posición inexistente

---

## 2. Actualizar etapa de entrevista de un candidato

**Endpoint:** `PUT /candidates/:id/stage`

### Descripción
Actualiza el campo `current_interview_step` de la aplicación de un candidato para una posición específica.

### Ejemplo de request
```bash
curl -X PUT http://localhost:3010/candidates/1/stage \
  -H "Content-Type: application/json" \
  -d '{
    "positionId": 1,
    "currentInterviewStep": 2
  }'
```

### Ejemplo de response
```json
{
  "message": "Interview step updated successfully"
}
```

### Casos de prueba
- [ ] Actualización exitosa
- [ ] Candidato o posición inexistente
- [ ] Datos incompletos o inválidos

---

> Agrega más endpoints y casos de prueba según se implementen nuevas funcionalidades. 