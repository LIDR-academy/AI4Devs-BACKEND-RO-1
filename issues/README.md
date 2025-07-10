# Issues - Sistema de Seguimiento de Tareas

## 📋 Propósito

Esta carpeta contiene el sistema de seguimiento de tareas e issues para el desarrollo del proyecto LTI. Cada archivo representa una funcionalidad o mejora específica que debe implementarse.

## 📁 Estructura de Issues

Cada issue sigue la nomenclatura:
```
<tipo>-<descripcion-breve>-<componente>.md
```

**Ejemplos:**
- `kanban-endpoints-backend.md`
- `authentication-system-fullstack.md`
- `file-upload-improvement-backend.md`

## 🎯 Formato Estándar de Issue

Cada issue debe contener:

### 📋 Encabezado
- **Título**: Descripción clara y concisa
- **Prioridad**: Alta/Media/Baja
- **Estimación**: Tiempo estimado en horas
- **Estado**: 🔴 Pendiente / 🟡 En Progreso / 🟢 Completado
- **Asignado a**: Desarrollador responsable

### 📝 Contenido Principal
- **Descripción**: Explicación detallada de la funcionalidad
- **Especificación Técnica**: Endpoints, interfaces, etc.
- **Archivos a Modificar**: Lista específica de archivos
- **Criterios de Aceptación**: Condiciones para considerar completado

### 🧪 Testing y Documentación
- **Tests Requeridos**: Tests unitarios e integración
- **Documentación**: Archivos de docs a actualizar

## 🔄 Workflow de Actualización

### 1. Marcar Progreso
Actualizar checkboxes ✅ conforme se completen las tareas:
```markdown
- [x] Tarea completada
- [ ] Tarea pendiente
```

### 2. Actualizar Estado
Cambiar el estado en el encabezado:
- 🔴 **Pendiente**: No iniciado
- 🟡 **En Progreso**: Desarrollo activo
- 🟢 **Completado**: Finalizado y probado

### 3. Actualizar Progreso General
Modificar la barra de progreso:
```
Backend Implementation: 60% ■■■■■■⬜⬜⬜⬜
```

### 4. Documentar Cambios
Agregar entradas al historial de cambios:
```markdown
| 2024-12-19 | Iniciado desarrollo | Developer |
| 2024-12-20 | Completada Fase 1 | Developer |
```

## 📊 Estados de Issues

### 🔴 Pendiente
- Issue creado pero no iniciado
- Análisis y estimación completados
- Listo para asignación

### 🟡 En Progreso  
- Desarrollo activo
- Al menos una tarea iniciada
- Check-ins regulares requeridos

### 🟢 Completado
- Todas las tareas completadas ✅
- Tests pasando
- Documentación actualizada
- Code review aprobado

### 🔵 En Review
- Desarrollo completado
- Esperando code review
- Tests pasando

### ⚫ Bloqueado
- Dependencias no resueltas
- Esperando decisiones técnicas
- Problemas técnicos sin resolver

## 🏷️ Etiquetas Sugeridas

Agregar etiquetas al título para categorización:

- `[BACKEND]` - Solo desarrollo backend
- `[FRONTEND]` - Solo desarrollo frontend  
- `[FULLSTACK]` - Requiere frontend y backend
- `[DATABASE]` - Cambios en BD o migraciones
- `[DOCS]` - Solo documentación
- `[BUGFIX]` - Corrección de errores
- `[FEATURE]` - Nueva funcionalidad
- `[IMPROVEMENT]` - Mejora de funcionalidad existente

## 📋 Template para Nuevos Issues

```markdown
# Issue #XXX: [ETIQUETA] Título del Issue

## 📋 Resumen
**Prioridad**: Alta/Media/Baja
**Estimación**: X horas
**Estado**: 🔴 Pendiente
**Asignado a**: Nombre

## 🎯 Descripción
[Descripción detallada]

## 📁 Archivos a Modificar
- [ ] archivo1.ts
- [ ] archivo2.js

## ✅ Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2

## 🧪 Tests
- [ ] Test unitario 1
- [ ] Test integración 1

## 📚 Documentación
- [ ] Actualizar api-reference.md

## 📊 Progreso: 0%
- 🔴 **Fase 1**: 0/X completadas

## 📝 Notas
[Notas adicionales]
```

## 📈 Métricas de Seguimiento

### Por Issue
- **Tiempo estimado vs real**
- **Número de tareas completadas**
- **Tests creados/pasando**
- **Documentación actualizada**

### General
- **Issues abiertos vs cerrados**  
- **Tiempo promedio de resolución**
- **Distribución por prioridad**
- **Backlog health**

## 🔧 Herramientas Complementarias

### Para Tracking Avanzado
- GitHub Issues (si se migra a GitHub)
- Jira (para equipos grandes)
- Trello (vista kanban)
- Notion (documentación extendida)

### Para Desarrollo
- VS Code con extensión TODO Highlight
- Git hooks para validar tareas
- Scripts de automatización para updates

---

**Tip**: Mantén los issues actualizados regularmente para un seguimiento efectivo del progreso del proyecto. 