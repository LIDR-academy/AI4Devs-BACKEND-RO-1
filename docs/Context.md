# Context.md - Auditoría del Proyecto LTI Talent Tracking System

## Resumen Ejecutivo

El proyecto LTI Talent Tracking System es una aplicación full-stack para la gestión de candidatos en procesos de reclutamiento. La aplicación está estructurada siguiendo principios de arquitectura limpia (Clean Architecture) con separación clara de responsabilidades entre frontend y backend.

## Arquitectura General

### Estructura del Proyecto
```
AI4Devs-BACKEND-RO-1/
├── backend/                 # Servidor Express.js + TypeScript
│   ├── src/
│   │   ├── domain/         # Modelos de dominio
│   │   ├── application/    # Lógica de aplicación
│   │   ├── presentation/   # Controladores
│   │   └── routes/         # Definición de rutas
│   ├── prisma/            # ORM y migraciones
│   └── package.json
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   └── services/       # Servicios de API
│   └── package.json
├── docker-compose.yml      # Configuración de PostgreSQL
└── README.md
```

## Análisis del Backend

### Patrones de Diseño Identificados

#### 1. **Arquitectura en Capas (Layered Architecture)**
- **Domain Layer**: Contiene los modelos de negocio
- **Application Layer**: Contiene la lógica de aplicación y servicios
- **Presentation Layer**: Contiene los controladores
- **Infrastructure Layer**: Prisma ORM para acceso a datos

#### 2. **Domain-Driven Design (DDD)**
- Modelos de dominio bien definidos con comportamiento encapsulado
- Entidades con métodos de negocio (ej: `Candidate.save()`)
- Separación clara entre dominio y infraestructura

#### 3. **Repository Pattern**
- Implementado a través de Prisma ORM
- Abstracción del acceso a datos
- Operaciones CRUD centralizadas

#### 4. **Service Layer Pattern**
- `candidateService.ts`: Orquesta operaciones complejas
- `fileUploadService.ts`: Maneja subida de archivos
- Separación de responsabilidades

#### 5. **Controller Pattern**
- `candidateController.ts`: Maneja requests HTTP
- Validación de entrada
- Transformación de respuestas

### Tecnologías del Backend

#### Stack Principal
- **Runtime**: Node.js
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Validación**: Custom validators
- **Documentación**: OpenAPI/Swagger

#### Dependencias Clave
```json
{
  "@prisma/client": "^5.13.0",
  "express": "^4.19.2",
  "multer": "^1.4.5-lts.1",
  "swagger-jsdoc": "^6.2.8",
  "cors": "^2.8.5"
}
```

### Estructura de Modelos de Dominio

#### Modelo Principal: Candidate
```typescript
export class Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    education: Education[];
    workExperience: WorkExperience[];
    resumes: Resume[];
    applications: Application[];

    async save() { /* ... */ }
    static async findOne(id: number): Promise<Candidate | null> { /* ... */ }
}
```

#### Relaciones del Modelo
- **One-to-Many**: Candidate → Education, WorkExperience, Resume, Application
- **Many-to-One**: Application → Position, InterviewStep
- **Many-to-Many**: Position ↔ InterviewFlow

### Validación de Datos

#### Estrategia de Validación
- **Validación en capa de aplicación** (`validator.ts`)
- **Expresiones regulares** para formatos específicos
- **Validación de longitud** según esquema de BD
- **Validación de tipos** y estructura

#### Reglas de Validación
```typescript
const NAME_REGEX = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(6|7|9)\d{8}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
```

### Manejo de Errores

#### Estrategia de Error Handling
- **Try-catch** en servicios y controladores
- **Error personalizados** para casos específicos
- **Códigos de estado HTTP** apropiados
- **Mensajes de error** descriptivos

#### Tipos de Errores Manejados
- Errores de validación (400)
- Errores de base de datos (500)
- Errores de archivo no encontrado (404)
- Errores de restricción única (P2002)

## Análisis del Frontend

### Patrones de Diseño Identificados

#### 1. **Component-Based Architecture**
- Componentes reutilizables
- Separación de responsabilidades
- Props drilling controlado

#### 2. **Service Layer Pattern**
- `candidateService.js`: Abstracción de llamadas API
- Separación de lógica de negocio y UI

#### 3. **Container/Presentational Pattern**
- Componentes de presentación (UI)
- Componentes contenedores (lógica)

### Tecnologías del Frontend

#### Stack Principal
- **Framework**: React 18
- **Lenguaje**: JavaScript/TypeScript
- **UI Library**: React Bootstrap
- **Routing**: React Router DOM
- **Date Picker**: React DatePicker
- **HTTP Client**: Fetch API

#### Dependencias Clave
```json
{
  "react": "^18.3.1",
  "react-bootstrap": "^2.10.2",
  "react-router-dom": "^6.23.1",
  "react-datepicker": "^6.9.0",
  "bootstrap": "^5.3.3"
}
```

### Estructura de Componentes

#### Componente Principal: AddCandidateForm
- **Estado local** con useState
- **Validación de formularios** en tiempo real
- **Manejo de archivos** con FileUploader
- **Gestión de arrays dinámicos** (educación, experiencia)

#### Características del Formulario
- **Campos dinámicos** para educación y experiencia
- **Validación de fechas** con DatePicker
- **Subida de archivos** CV
- **Manejo de errores** con Alert components

### Gestión de Estado

#### Estado Local
- **useState** para formularios
- **Estado de error** y éxito
- **Estado de carga** implícito

#### Comunicación con Backend
- **Fetch API** para llamadas HTTP
- **FormData** para subida de archivos
- **JSON** para datos estructurados

## Base de Datos

### Esquema de Base de Datos

#### Modelo Principal: Candidate
```sql
model Candidate {
  id                Int               @id @default(autoincrement())
  firstName         String            @db.VarChar(100)
  lastName          String            @db.VarChar(100)
  email             String            @unique @db.VarChar(255)
  phone             String?           @db.VarChar(15)
  address           String?           @db.VarChar(100)
  educations        Education[]
  workExperiences   WorkExperience[]
  resumes           Resume[]
  applications      Application[]
}
```

#### Relaciones Complejas
- **InterviewFlow**: Define flujos de entrevista
- **InterviewStep**: Pasos específicos en el flujo
- **Position**: Puestos de trabajo
- **Application**: Aplicaciones de candidatos
- **Interview**: Entrevistas realizadas

### Migraciones
- **4 migraciones** implementadas
- **Evolución incremental** del esquema
- **Versionado** de cambios de BD

## API Design

### Endpoints Principales

#### POST /candidates
- **Creación** de candidatos
- **Validación** de datos de entrada
- **Respuesta estructurada** con códigos de estado

#### GET /candidates/:id
- **Recuperación** de candidatos por ID
- **Inclusión** de relaciones (educación, experiencia, etc.)

#### POST /upload
- **Subida de archivos** CV
- **Validación** de tipos de archivo
- **Almacenamiento** en sistema de archivos

### Documentación API
- **OpenAPI 3.0** specification
- **Swagger UI** para testing
- **Esquemas detallados** de request/response

## DevOps y Configuración

### Docker
- **PostgreSQL** containerizado
- **Variables de entorno** para configuración
- **Persistencia** de datos

### Scripts de Desarrollo
```json
{
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "prisma:generate": "npx prisma generate",
  "prisma:migrate": "npx prisma migrate dev"
}
```

## Fortalezas del Proyecto

### 1. **Arquitectura Sólida**
- Separación clara de responsabilidades
- Principios SOLID aplicados
- Patrones de diseño bien implementados

### 2. **Type Safety**
- TypeScript en backend
- Interfaces bien definidas
- Validación robusta

### 3. **Escalabilidad**
- Arquitectura modular
- Base de datos relacional bien diseñada
- API RESTful

### 4. **Mantenibilidad**
- Código bien estructurado
- Documentación clara
- Convenciones consistentes

## Áreas de Mejora Identificadas

### 1. **Frontend**
- **Inconsistencia**: App.js vs App.tsx
- **Falta de TypeScript**: Componentes en JavaScript
- **Estado global**: No hay gestión centralizada
- **Testing**: Sin tests implementados

### 2. **Backend**
- **Logging**: Sistema básico de logs
- **Testing**: Tests unitarios limitados
- **Autenticación**: No implementada
- **Rate limiting**: No configurado

### 3. **Seguridad**
- **Validación**: Solo en backend
- **Sanitización**: Básica
- **CORS**: Configuración simple
- **File upload**: Validación limitada

### 4. **Performance**
- **Caching**: No implementado
- **Pagination**: No en listados
- **Optimización**: Consultas N+1 potenciales

## Recomendaciones para Futuras Tareas

### 1. **Inmediatas**
- Migrar frontend a TypeScript completamente
- Implementar tests unitarios
- Añadir validación en frontend
- Mejorar manejo de errores

### 2. **Medio Plazo**
- Implementar autenticación/autorización
- Añadir sistema de logging
- Implementar caching
- Optimizar consultas de BD

### 3. **Largo Plazo**
- Implementar microservicios
- Añadir monitoreo y métricas
- Implementar CI/CD
- Añadir documentación de API interactiva

## Conclusión

El proyecto LTI Talent Tracking System presenta una arquitectura sólida basada en principios de Clean Architecture y Domain-Driven Design. La separación de responsabilidades está bien implementada, y el uso de TypeScript y Prisma proporciona type safety y productividad.

Las principales fortalezas radican en la estructura del backend y el diseño de la base de datos. Las áreas de mejora se centran principalmente en el frontend (consistencia de tecnologías) y aspectos de seguridad y testing.

Para futuras tareas, se recomienda mantener la arquitectura actual y enfocarse en completar la implementación de TypeScript en el frontend, añadir tests y mejorar la seguridad de la aplicación. 