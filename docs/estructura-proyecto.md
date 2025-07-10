# Estructura del Proyecto - LTI Talent Tracking System

## 📁 Árbol de Directorio

```
AI4Devs-BACKEND-RO-1/
├── 📁 backend/                    # Aplicación servidor (API)
│   ├── 📁 src/                    # Código fuente del backend
│   │   ├── 📁 application/        # Capa de aplicación
│   │   │   ├── 📁 services/       # Servicios de negocio
│   │   │   │   ├── candidateService.ts
│   │   │   │   └── fileUploadService.ts
│   │   │   └── validator.ts       # Validadores de datos
│   │   ├── 📁 domain/             # Capa de dominio
│   │   │   └── 📁 models/         # Modelos de dominio
│   │   │       ├── Application.ts
│   │   │       ├── Candidate.ts
│   │   │       ├── Company.ts
│   │   │       ├── Education.ts
│   │   │       ├── Employee.ts
│   │   │       ├── Interview.ts
│   │   │       ├── InterviewFlow.ts
│   │   │       ├── InterviewStep.ts
│   │   │       ├── InterviewType.ts
│   │   │       ├── Position.ts
│   │   │       ├── Resume.ts
│   │   │       └── WorkExperience.ts
│   │   ├── 📁 presentation/       # Capa de presentación
│   │   │   └── 📁 controllers/    # Controladores HTTP
│   │   │       └── candidateController.ts
│   │   ├── 📁 routes/             # Definición de rutas
│   │   │   └── candidateRoutes.ts
│   │   └── index.ts               # Punto de entrada del servidor
│   ├── 📁 prisma/                 # Configuración de base de datos
│   │   ├── 📁 migrations/         # Migraciones de BD
│   │   │   ├── 📁 20240528082702_/
│   │   │   ├── 📁 20240528085016_/
│   │   │   ├── 📁 20240528110522_/
│   │   │   ├── 📁 20240528140846_/
│   │   │   └── migration_lock.toml
│   │   ├── schema.prisma          # Schema de base de datos
│   │   └── seed.ts                # Datos iniciales
│   ├── api-spec.yaml              # Especificación OpenAPI
│   ├── jest.config.js             # Configuración de tests
│   ├── package.json               # Dependencias del backend
│   ├── package-lock.json          # Lock de dependencias
│   └── tsconfig.json              # Configuración TypeScript
├── 📁 frontend/                   # Aplicación cliente (React)
│   ├── 📁 src/                    # Código fuente del frontend
│   │   ├── 📁 components/         # Componentes React
│   │   │   ├── AddCandidateForm.js
│   │   │   ├── FileUploader.js
│   │   │   └── RecruiterDashboard.js
│   │   ├── 📁 services/           # Servicios de API
│   │   │   └── candidateService.js
│   │   ├── 📁 assets/             # Recursos estáticos
│   │   │   └── lti-logo.png
│   │   ├── App.tsx                # Componente raíz
│   │   ├── App.css                # Estilos principales
│   │   ├── index.tsx              # Punto de entrada
│   │   ├── index.css              # Estilos globales
│   │   └── ...                    # Otros archivos de React
│   ├── 📁 public/                 # Archivos públicos
│   │   ├── index.html             # HTML principal
│   │   ├── favicon.ico            # Icono de la aplicación
│   │   └── ...                    # Otros assets públicos
│   ├── package.json               # Dependencias del frontend
│   ├── package-lock.json          # Lock de dependencias
│   └── tsconfig.json              # Configuración TypeScript
├── 📁 docs/                       # Documentación del proyecto
│   ├── README.md                  # Índice de documentación
│   ├── proposito-negocio.md       # Propósito del negocio
│   ├── estructura-proyecto.md     # Este archivo
│   └── ...                        # Otros archivos de docs
├── docker-compose.yml             # Configuración Docker
├── package.json                   # Configuración raíz
├── README.md                      # Documentación principal
├── LICENSE.md                     # Licencia del proyecto
└── VERSION                        # Versión del proyecto
```

## 📊 Arquitectura de Capas

### Backend (Arquitectura Hexagonal)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Controllers   │    │     Routes      │                │
│  │                 │    │                 │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                         │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │    Services     │    │   Validators    │                │
│  │                 │    │                 │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                            │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │     Models      │    │  Business Logic │                │
│  │                 │    │                 │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Prisma ORM    │    │   Database      │                │
│  │                 │    │   PostgreSQL    │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Frontend (Arquitectura por Componentes)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Components    │    │     Pages       │                │
│  │                 │    │                 │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                            │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  API Services   │    │  Utils/Helpers  │                │
│  │                 │    │                 │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Descripción Detallada

### 🔧 Backend (`/backend`)

#### **Capa de Presentación** (`/src/presentation`)
- **Controllers**: Manejan las peticiones HTTP y respuestas
- **Responsabilidad**: Validación de entrada, formateo de respuestas, manejo de errores HTTP

#### **Capa de Aplicación** (`/src/application`)
- **Services**: Lógica de negocio y orquestación de casos de uso
- **Validators**: Validación de datos de entrada
- **Responsabilidad**: Coordinación entre capas, validación de reglas de negocio

#### **Capa de Dominio** (`/src/domain`)
- **Models**: Entidades de negocio con su lógica interna
- **Responsabilidad**: Representación de conceptos del negocio, reglas de dominio

#### **Rutas** (`/src/routes`)
- **Definición**: Mapeo de endpoints HTTP a controladores
- **Responsabilidad**: Configuración de rutas, middleware, autenticación

#### **Base de Datos** (`/prisma`)
- **Schema**: Definición de modelos de datos
- **Migrations**: Historial de cambios en la base de datos
- **Seed**: Datos iniciales para desarrollo/testing

### 🎨 Frontend (`/frontend`)

#### **Componentes** (`/src/components`)
- **Funcionalidad**: Componentes reutilizables de React
- **Ejemplos**:
  - `AddCandidateForm`: Formulario para agregar candidatos
  - `RecruiterDashboard`: Dashboard principal para reclutadores
  - `FileUploader`: Componente para subir archivos

#### **Servicios** (`/src/services`)
- **Funcionalidad**: Comunicación con la API del backend
- **Responsabilidad**: Abstracción de llamadas HTTP, manejo de errores

#### **Assets** (`/src/assets`)
- **Contenido**: Imágenes, iconos, fuentes
- **Organización**: Recursos estáticos del proyecto

### 🐳 Infraestructura

#### **Docker** (`docker-compose.yml`)
- **Propósito**: Orquestación de servicios
- **Servicios**:
  - PostgreSQL: Base de datos principal
  - Configuración de variables de entorno

#### **Configuración** (archivos raíz)
- `package.json`: Configuración del workspace
- `tsconfig.json`: Configuración TypeScript
- `README.md`: Documentación principal

## 📁 Convenciones de Nomenclatura

### Archivos y Carpetas
- **Carpetas**: `kebab-case` (ej: `interview-flow`)
- **Archivos TS/JS**: `camelCase` (ej: `candidateService.ts`)
- **Componentes React**: `PascalCase` (ej: `AddCandidateForm.js`)
- **Archivos de configuración**: `kebab-case` (ej: `docker-compose.yml`)

### Código
- **Clases**: `PascalCase` (ej: `CandidateService`)
- **Funciones/Variables**: `camelCase` (ej: `addCandidate`)
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `MAX_FILE_SIZE`)
- **Interfaces**: `PascalCase` con prefijo `I` (ej: `ICandidate`)

## 🔄 Flujo de Datos

### Flujo de Petición (Backend)
```
HTTP Request → Routes → Controllers → Services → Models → Database
```

### Flujo de Respuesta (Backend)
```
Database → Models → Services → Controllers → HTTP Response
```

### Flujo de Interacción (Frontend)
```
User Interaction → Components → Services → API Call → Backend
```

## 📝 Archivos de Configuración Importantes

| Archivo | Propósito | Ubicación |
|---------|-----------|-----------|
| `package.json` | Dependencias y scripts | `/backend`, `/frontend` |
| `tsconfig.json` | Configuración TypeScript | `/backend`, `/frontend` |
| `schema.prisma` | Schema de base de datos | `/backend/prisma` |
| `docker-compose.yml` | Orquestación Docker | `/` |
| `jest.config.js` | Configuración de tests | `/backend` |
| `api-spec.yaml` | Especificación OpenAPI | `/backend` |

---

**Nota**: Esta estructura sigue principios de arquitectura limpia y separación de responsabilidades para facilitar el mantenimiento y escalabilidad del proyecto. 