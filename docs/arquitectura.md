# Arquitectura del Sistema - LTI Talent Tracking System

## 🏗️ Visión General de la Arquitectura

El sistema LTI está diseñado siguiendo una **arquitectura hexagonal** (ports & adapters) en el backend y una **arquitectura basada en componentes** en el frontend, facilitando el mantenimiento, testing y escalabilidad.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITECTURA GENERAL                              │
│                                                                             │
│  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐ │
│  │   FRONTEND       │  HTTP   │    BACKEND      │  SQL    │   DATABASE      │ │
│  │   (React SPA)   │◄───────►│  (Express API)  │◄───────►│  (PostgreSQL)   │ │
│  │                 │         │                 │         │                 │ │
│  └─────────────────┘         └─────────────────┘         └─────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 Arquitectura del Backend

### Diseño Hexagonal (Ports & Adapters)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITECTURA HEXAGONAL                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                          DOMAIN CORE                                    │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │ │
│  │  │   Candidate     │    │   Position      │    │   Interview     │     │ │
│  │  │   Education     │    │   Company       │    │   Application   │     │ │
│  │  │   Experience    │    │   Employee      │    │   Resume        │     │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                       │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐ │
│  │              APPLICATION SERVICES                                      │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │ │
│  │  │ CandidateService│    │ FileUploadSvc   │    │   Validators    │     │ │
│  │  │                 │    │                 │    │                 │     │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                       │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐ │
│  │                    ADAPTERS                                             │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │ │
│  │  │   Controllers   │    │     Routes      │    │   Prisma ORM    │     │ │
│  │  │   (HTTP IN)     │    │   (HTTP IN)     │    │   (DB OUT)      │     │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Capas del Backend

#### 1. **Capa de Dominio** (`/src/domain`)
```typescript
// Ejemplo: Candidate.ts
export class Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    
    // Métodos de dominio
    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
    
    async save(): Promise<Candidate> {
        // Lógica de persistencia
    }
}
```

**Responsabilidades:**
- Entidades de negocio con su lógica interna
- Reglas de dominio y validaciones
- Operaciones de persistencia básicas

#### 2. **Capa de Aplicación** (`/src/application`)
```typescript
// Ejemplo: candidateService.ts
export const addCandidate = async (candidateData: any) => {
    // Validación de datos
    validateCandidateData(candidateData);
    
    // Creación del candidato
    const candidate = new Candidate(candidateData);
    const savedCandidate = await candidate.save();
    
    // Lógica de negocio adicional
    await processEducations(savedCandidate.id, candidateData.educations);
    await processExperiences(savedCandidate.id, candidateData.workExperiences);
    
    return savedCandidate;
};
```

**Responsabilidades:**
- Orquestación de casos de uso
- Coordinación entre entidades
- Validación de reglas de negocio

#### 3. **Capa de Presentación** (`/src/presentation`)
```typescript
// Ejemplo: candidateController.ts
export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const newCandidate = await addCandidate(candidateData);
        
        res.status(201).json({
            success: true,
            data: newCandidate,
            message: 'Candidato creado exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
```

**Responsabilidades:**
- Manejo de peticiones HTTP
- Transformación de datos entrada/salida
- Manejo de errores y respuestas

### Flujo de Datos Backend

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   HTTP Request  │───►│   Controllers   │───►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  HTTP Response  │◄───│   Controllers   │◄───│   Models        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                               ┌─────────────────┐
                                               │   Database      │
                                               └─────────────────┘
```

## 🎨 Arquitectura del Frontend

### Diseño Basado en Componentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ARQUITECTURA FRONTEND                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        PRESENTATION LAYER                               │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │ │
│  │  │      Pages      │    │   Components    │    │      Router     │     │ │
│  │  │                 │    │                 │    │                 │     │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                       │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐ │
│  │                    SERVICE LAYER                                        │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │ │
│  │  │  API Services   │    │     Utils       │    │     Hooks       │     │ │
│  │  │                 │    │                 │    │                 │     │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Componentes del Frontend

#### 1. **Componentes de Página**
```typescript
// Ejemplo: RecruiterDashboard.js
const RecruiterDashboard = () => {
    return (
        <Container className="mt-5">
            <Logo />
            <Header title="Dashboard del Reclutador" />
            <ActionCards />
        </Container>
    );
};
```

#### 2. **Componentes Reutilizables**
```typescript
// Ejemplo: AddCandidateForm.js
const AddCandidateForm = () => {
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await candidateService.addCandidate(formData);
            // Manejar éxito
        } catch (error) {
            // Manejar error
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Form onSubmit={handleSubmit}>
            {/* Campos del formulario */}
        </Form>
    );
};
```

#### 3. **Servicios de API**
```typescript
// Ejemplo: candidateService.js
const API_BASE_URL = 'http://localhost:3010';

export const candidateService = {
    async addCandidate(candidateData) {
        const response = await fetch(`${API_BASE_URL}/candidates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(candidateData),
        });
        
        if (!response.ok) {
            throw new Error('Error al agregar candidato');
        }
        
        return response.json();
    },
    
    async getCandidateById(id) {
        const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
        return response.json();
    }
};
```

### Flujo de Datos Frontend

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Action    │───►│   Component     │───►│   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Update     │◄───│   Component     │◄───│   API Call      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Comunicación Entre Capas

### Protocolo de Comunicación

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          COMUNICACIÓN SYSTEM                                │
│                                                                             │
│  Frontend (React)                    Backend (Express)                      │
│  ┌─────────────────┐                ┌─────────────────┐                    │
│  │                 │   HTTP/JSON    │                 │                    │
│  │   Components    │◄──────────────►│   Controllers   │                    │
│  │                 │                │                 │                    │
│  └─────────────────┘                └─────────────────┘                    │
│           │                                   │                            │
│  ┌─────────────────┐                ┌─────────────────┐                    │
│  │   API Services  │                │   Services      │                    │
│  │                 │                │                 │                    │
│  └─────────────────┘                └─────────────────┘                    │
│                                               │                            │
│                                      ┌─────────────────┐                    │
│                                      │   Database      │                    │
│                                      │   (PostgreSQL)  │                    │
│                                      └─────────────────┘                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Endpoints de API

| Método | Endpoint | Descripción | Controlador |
|--------|----------|-------------|-------------|
| POST | `/candidates` | Crear candidato | `candidateController.addCandidate` |
| GET | `/candidates/:id` | Obtener candidato | `candidateController.getCandidate` |
| PUT | `/candidates/:id` | Actualizar candidato | `candidateController.updateCandidate` |
| DELETE | `/candidates/:id` | Eliminar candidato | `candidateController.deleteCandidate` |

## 📊 Modelo de Datos

### Entidades Principales

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MODELO DE DATOS                                   │
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   Candidate     │    │   Position      │    │   Company       │         │
│  ├─────────────────┤    ├─────────────────┤    ├─────────────────┤         │
│  │ • id            │    │ • id            │    │ • id            │         │
│  │ • firstName     │    │ • title         │    │ • name          │         │
│  │ • lastName      │    │ • description   │    │ • employees     │         │
│  │ • email         │    │ • status        │    │ • positions     │         │
│  │ • phone         │    │ • salary        │    │                 │         │
│  │ • address       │    │ • location      │    │                 │         │
│  │ • educations    │    │ • company       │    │                 │         │
│  │ • experiences   │    │ • applications  │    │                 │         │
│  │ • resumes       │    │                 │    │                 │         │
│  │ • applications  │    │                 │    │                 │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│           │                       │                       │                │
│           └───────────────────────┼───────────────────────┘                │
│                                   │                                        │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  Application    │    │   Interview     │    │ InterviewFlow   │         │
│  ├─────────────────┤    ├─────────────────┤    ├─────────────────┤         │
│  │ • id            │    │ • id            │    │ • id            │         │
│  │ • candidateId   │    │ • applicationId │    │ • description   │         │
│  │ • positionId    │    │ • stepId        │    │ • steps         │         │
│  │ • applicationDate│   │ • employeeId    │    │ • positions     │         │
│  │ • currentStep   │    │ • date          │    │                 │         │
│  │ • interviews    │    │ • result        │    │                 │         │
│  │ • notes         │    │ • score         │    │                 │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🛡️ Seguridad y Validación

### Validación de Datos

```typescript
// Backend: Validación de entrada
export const validateCandidateData = (data: any) => {
    const errors = [];
    
    if (!data.firstName || data.firstName.length < 2) {
        errors.push('First name is required and must be at least 2 characters');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
    }
    
    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

// Frontend: Validación de formulario
const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.firstName) {
        errors.firstName = 'Nombre es requerido';
    }
    
    if (!formData.email) {
        errors.email = 'Email es requerido';
    }
    
    return errors;
};
```

### Manejo de Errores

```typescript
// Backend: Manejo centralizado de errores
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Error interno del servidor';
    
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

// Frontend: Manejo de errores en servicios
const handleApiError = (error) => {
    if (error.response) {
        // Error de respuesta del servidor
        return error.response.data.message;
    } else if (error.request) {
        // Error de red
        return 'Error de conexión';
    } else {
        // Error de configuración
        return 'Error inesperado';
    }
};
```

## 🚀 Escalabilidad y Rendimiento

### Estrategias de Optimización

#### Backend
- **Conexión pooling**: Prisma maneja automáticamente el pool de conexiones
- **Indexación**: Índices en campos frecuentemente consultados
- **Paginación**: Implementación de limit/offset para listas grandes
- **Caching**: Preparado para implementar Redis en el futuro

#### Frontend
- **Code splitting**: Lazy loading de componentes
- **Memoización**: React.memo para componentes que no cambian frecuentemente
- **Optimización de bundle**: Create React App optimiza automáticamente

### Monitoreo y Logging

```typescript
// Backend: Logger estructurado
const logger = {
    info: (message: string, meta?: any) => {
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta);
    },
    error: (message: string, error?: Error) => {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error);
    }
};

// Uso en controladores
logger.info('Candidate created', { candidateId: newCandidate.id });
```

## 🔮 Arquitectura Futura

### Mejoras Planificadas

1. **Microservicios**: Separación en servicios independientes
2. **Event-driven**: Implementación de eventos para comunicación entre servicios
3. **API Gateway**: Centralización de rutas y autenticación
4. **Caching**: Redis para mejorar rendimiento
5. **Monitoreo**: Implementación de métricas y alertas

---

**Nota**: Esta arquitectura está diseñada para ser mantenible, escalable y seguir las mejores prácticas de desarrollo software moderno. 