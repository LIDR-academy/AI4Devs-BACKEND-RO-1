# API Reference - LTI Talent Tracking System

## 🚀 Información General

La API de LTI es una API REST que permite gestionar todo el ciclo de vida del proceso de reclutamiento.

### URL Base
```
http://localhost:3010
```

### Formato de Respuesta
Todas las respuestas siguen el formato JSON estándar:

```json
{
  "success": true,
  "data": {},
  "message": "Mensaje descriptivo"
}
```

### Códigos de Estado HTTP

| Código | Significado | Descripción |
|---------|-------------|-------------|
| 200 | OK | Petición exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Error en la petición |
| 401 | Unauthorized | No autorizado |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error interno del servidor |

## 📋 Endpoints Disponibles

### 1. Endpoint Raíz

#### GET /
Endpoint de verificación del servidor.

**Respuesta:**
```
Hola LTI!
```

**Ejemplo:**
```bash
curl http://localhost:3010/
```

### 2. Gestión de Candidatos

#### POST /candidates
Crear un nuevo candidato.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "phone": "string",
  "address": "string",
  "educations": [
    {
      "institution": "string",
      "title": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD"
    }
  ],
  "workExperiences": [
    {
      "company": "string",
      "position": "string",
      "description": "string",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD"
    }
  ],
  "cv": {
    "filePath": "string",
    "fileType": "string"
  }
}
```

**Validaciones:**
- `firstName`: Requerido, mínimo 2 caracteres, máximo 50, solo letras
- `lastName`: Requerido, mínimo 2 caracteres, máximo 50, solo letras
- `email`: Requerido, formato email válido
- `phone`: Opcional, formato numérico
- `address`: Opcional, máximo 100 caracteres

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@email.com",
    "phone": "123456789",
    "address": "Calle Ejemplo 123",
    "educations": [...],
    "workExperiences": [...],
    "resumes": [...]
  },
  "message": "Candidato creado exitosamente"
}
```

**Respuesta de Error (400):**
```json
{
  "success": false,
  "message": "Error de validación: Email ya existe"
}
```

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:3010/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@test.com",
    "phone": "123456789",
    "address": "Test Address",
    "educations": [
      {
        "institution": "Universidad Test",
        "title": "Ingeniería en Sistemas",
        "startDate": "2020-01-01",
        "endDate": "2024-01-01"
      }
    ],
    "workExperiences": [
      {
        "company": "Empresa Test",
        "position": "Desarrollador",
        "description": "Desarrollo de aplicaciones",
        "startDate": "2024-01-01",
        "endDate": "2024-12-01"
      }
    ]
  }'
```

#### GET /candidates/:id
Obtener información de un candidato específico.

**Parámetros:**
- `id`: ID del candidato (integer)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@email.com",
    "phone": "123456789",
    "address": "Calle Ejemplo 123",
    "educations": [
      {
        "id": 1,
        "institution": "Universidad Test",
        "title": "Ingeniería en Sistemas",
        "startDate": "2020-01-01T00:00:00.000Z",
        "endDate": "2024-01-01T00:00:00.000Z"
      }
    ],
    "workExperiences": [
      {
        "id": 1,
        "company": "Empresa Test",
        "position": "Desarrollador",
        "description": "Desarrollo de aplicaciones",
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-01T00:00:00.000Z"
      }
    ],
    "resumes": [
      {
        "id": 1,
        "filePath": "uploads/cv.pdf",
        "fileType": "application/pdf",
        "uploadDate": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "message": "Candidato obtenido exitosamente"
}
```

**Respuesta de Error (404):**
```json
{
  "success": false,
  "message": "Candidato no encontrado"
}
```

**Ejemplo cURL:**
```bash
curl http://localhost:3010/candidates/1
```

## 🔧 Modelos de Datos

### Candidate
```typescript
interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: Education[];
  workExperiences?: WorkExperience[];
  resumes?: Resume[];
  applications?: Application[];
}
```

### Education
```typescript
interface Education {
  id: number;
  candidateId: number;
  institution: string;
  title: string;
  startDate: Date;
  endDate?: Date;
}
```

### WorkExperience
```typescript
interface WorkExperience {
  id: number;
  candidateId: number;
  company: string;
  position: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
}
```

### Resume
```typescript
interface Resume {
  id: number;
  candidateId: number;
  filePath: string;
  fileType: string;
  uploadDate: Date;
}
```

### Position
```typescript
interface Position {
  id: number;
  companyId: number;
  interviewFlowId: number;
  title: string;
  description: string;
  status: string;
  isVisible: boolean;
  location: string;
  jobDescription: string;
  requirements?: string;
  responsibilities?: string;
  salaryMin?: number;
  salaryMax?: number;
  employmentType?: string;
  benefits?: string;
  companyDescription?: string;
  applicationDeadline?: Date;
  contactInfo?: string;
}
```

### Application
```typescript
interface Application {
  id: number;
  positionId: number;
  candidateId: number;
  currentInterviewStep: number;
  applicationDate: Date;
  notes?: string;
}
```

## 🔐 Autenticación y Autorización

**Nota**: La versión actual no implementa autenticación. En versiones futuras se implementará:

- JWT tokens para autenticación
- Roles y permisos basados en usuario
- OAuth 2.0 para integración con terceros

## 📝 Validaciones

### Validaciones de Candidato

```typescript
const candidateValidations = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/
  },
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  phone: {
    optional: true,
    pattern: /^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/
  },
  address: {
    optional: true,
    maxLength: 100
  }
};
```

### Códigos de Error Comunes

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| VALIDATION_ERROR | Error de validación | Datos de entrada inválidos |
| DUPLICATE_EMAIL | Email ya existe | Email duplicado en la base de datos |
| CANDIDATE_NOT_FOUND | Candidato no encontrado | ID de candidato inválido |
| DATABASE_ERROR | Error de base de datos | Error interno de la base de datos |

## 🚀 Endpoints Futuros (Roadmap)

### Gestión de Posiciones
- `GET /positions` - Listar posiciones
- `POST /positions` - Crear posición
- `GET /positions/:id` - Obtener posición
- `PUT /positions/:id` - Actualizar posición
- `DELETE /positions/:id` - Eliminar posición

### Gestión de Aplicaciones
- `GET /applications` - Listar aplicaciones
- `POST /applications` - Crear aplicación
- `GET /applications/:id` - Obtener aplicación
- `PUT /applications/:id` - Actualizar aplicación

### Gestión de Entrevistas
- `GET /interviews` - Listar entrevistas
- `POST /interviews` - Programar entrevista
- `GET /interviews/:id` - Obtener entrevista
- `PUT /interviews/:id` - Actualizar entrevista

### Gestión de Empresas
- `GET /companies` - Listar empresas
- `POST /companies` - Crear empresa
- `GET /companies/:id` - Obtener empresa

### Subida de Archivos
- `POST /candidates/:id/upload-cv` - Subir CV
- `GET /candidates/:id/download-cv` - Descargar CV

## 🔧 Herramientas de Desarrollo

### Swagger/OpenAPI
La documentación interactiva de la API está disponible en:
```
http://localhost:3010/api-docs
```

### Postman Collection
Próximamente: Colección de Postman para pruebas de API.

### Insomnia Workspace
Próximamente: Workspace de Insomnia para desarrolladores.

## 📚 Ejemplos de Uso

### Flujo Completo de Creación de Candidato

```javascript
// 1. Crear candidato
const candidateData = {
  firstName: "María",
  lastName: "García",
  email: "maria.garcia@email.com",
  phone: "987654321",
  address: "Avenida Principal 456",
  educations: [
    {
      institution: "Universidad Nacional",
      title: "Licenciatura en Administración",
      startDate: "2018-03-01",
      endDate: "2022-12-15"
    }
  ],
  workExperiences: [
    {
      company: "Consultora ABC",
      position: "Analista de Sistemas",
      description: "Análisis y mejora de procesos",
      startDate: "2023-01-15",
      endDate: "2024-10-30"
    }
  ]
};

// Crear candidato
fetch('http://localhost:3010/candidates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(candidateData)
})
.then(response => response.json())
.then(data => {
  console.log('Candidato creado:', data);
  
  // 2. Obtener candidato creado
  return fetch(`http://localhost:3010/candidates/${data.data.id}`);
})
.then(response => response.json())
.then(data => {
  console.log('Candidato obtenido:', data);
});
```

### Manejo de Errores

```javascript
async function createCandidate(candidateData) {
  try {
    const response = await fetch('http://localhost:3010/candidates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear candidato');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}
```

## 🧪 Testing de la API

### Pruebas Unitarias

```bash
# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm run test:coverage
```

### Pruebas de Integración

```bash
# Ejecutar tests de integración
npm run test:integration
```

### Pruebas de Endpoints

```bash
# Probar salud de la API
curl http://localhost:3010/health

# Probar creación de candidato
curl -X POST http://localhost:3010/candidates \
  -H "Content-Type: application/json" \
  -d @candidate-test.json
```

## 📊 Rate Limiting

**Nota**: En versiones futuras se implementará rate limiting:
- 100 peticiones por minuto por IP
- 1000 peticiones por hora por usuario autenticado

## 🔄 Versionado de API

**Versión Actual**: v1.0.0
**URL con Versión**: `http://localhost:3010/v1/candidates`

### Estrategia de Versionado
- Versionado semántico (SemVer)
- Compatibilidad hacia atrás durante 2 versiones
- Deprecación gradual de endpoints antiguos

---

**Nota**: Esta documentación se actualiza automáticamente con cada release. Para la versión más reciente, consultar la documentación en línea. 