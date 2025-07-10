# Guía de Desarrollo - LTI Talent Tracking System

## 🚀 Configuración del Entorno de Desarrollo

### Requisitos del Desarrollador

- **IDE Recomendado**: Visual Studio Code
- **Extensiones Esenciales**:
  - TypeScript and JavaScript Language Features
  - Prisma
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - GitLens
  - Thunder Client (para pruebas de API)

### Configuración Inicial

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/AI4Devs-BACKEND-RO-1.git
cd AI4Devs-BACKEND-RO-1

# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# Configurar variables de entorno
cp backend/.env.example backend/.env
```

## 📐 Convenciones de Código

### Nomenclatura

#### TypeScript/JavaScript
```typescript
// Clases - PascalCase
class CandidateService {}

// Interfaces - PascalCase con prefijo I
interface ICandidate {}

// Funciones y Variables - camelCase
const addCandidate = () => {}
const candidateList = []

// Constantes - UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10485760
const API_BASE_URL = 'http://localhost:3010'

// Archivos - camelCase
candidateService.ts
addCandidateForm.js
```

#### React Components
```jsx
// Componentes - PascalCase
const AddCandidateForm = () => {}
const RecruiterDashboard = () => {}

// Props - camelCase
interface CandidateFormProps {
  onSubmit: (data: CandidateData) => void
  isLoading: boolean
}

// Hooks personalizados - camelCase con prefijo 'use'
const useCandidate = () => {}
const useCandidateForm = () => {}
```

#### Base de Datos
```sql
-- Tablas - PascalCase
CREATE TABLE "Candidate" (...)
CREATE TABLE "WorkExperience" (...)

-- Campos - camelCase
firstName VARCHAR(100)
applicationDate TIMESTAMP
```

### Estructura de Archivos

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes
│   ├── forms/          # Formularios
│   └── ui/             # Componentes de UI
├── pages/              # Páginas/Vistas
├── services/           # Servicios de API
├── hooks/              # Hooks personalizados
├── utils/              # Utilidades
├── types/              # Definiciones de tipos
├── constants/          # Constantes
└── assets/             # Recursos estáticos
```

## 🔧 Flujo de Desarrollo

### Workflow de Git

```bash
# 1. Crear rama para nueva funcionalidad
git checkout -b feature/add-candidate-search

# 2. Hacer commits frecuentes y descriptivos
git add .
git commit -m "feat: add candidate search functionality"

# 3. Mantener la rama actualizada
git checkout main
git pull origin main
git checkout feature/add-candidate-search
git rebase main

# 4. Crear Pull Request
git push origin feature/add-candidate-search
```

### Convenciones de Commit

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato
refactor: refactorización de código
test: agregar o corregir tests
chore: cambios en build o herramientas
```

**Ejemplos:**
```bash
git commit -m "feat: add candidate search endpoint"
git commit -m "fix: resolve candidate email validation issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: improve candidate service error handling"
```

## 🏗️ Arquitectura de Desarrollo

### Backend Development

#### Estructura de Capas
```
src/
├── domain/             # Lógica de negocio
│   └── models/        # Entidades de dominio
├── application/        # Casos de uso
│   └── services/      # Servicios de aplicación
├── presentation/       # Capa de presentación
│   └── controllers/   # Controladores HTTP
├── infrastructure/     # Infraestructura
│   └── database/      # Configuración de BD
└── routes/            # Definición de rutas
```

#### Crear un Nuevo Endpoint

1. **Definir el Modelo** (Domain)
```typescript
// src/domain/models/Position.ts
export class Position {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public companyId: number
  ) {}

  async save(): Promise<Position> {
    // Lógica de persistencia
  }
}
```

2. **Crear el Servicio** (Application)
```typescript
// src/application/services/positionService.ts
import { Position } from '../../domain/models/Position';

export const createPosition = async (positionData: any): Promise<Position> => {
  // Validación
  validatePositionData(positionData);
  
  // Lógica de negocio
  const position = new Position(positionData);
  return await position.save();
};
```

3. **Crear el Controlador** (Presentation)
```typescript
// src/presentation/controllers/positionController.ts
import { Request, Response } from 'express';
import { createPosition } from '../../application/services/positionService';

export const createPositionController = async (req: Request, res: Response) => {
  try {
    const position = await createPosition(req.body);
    res.status(201).json({
      success: true,
      data: position,
      message: 'Posición creada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
```

4. **Definir la Ruta** (Routes)
```typescript
// src/routes/positionRoutes.ts
import express from 'express';
import { createPositionController } from '../presentation/controllers/positionController';

const router = express.Router();

router.post('/', createPositionController);

export default router;
```

### Frontend Development

#### Estructura de Componentes
```jsx
// components/AddCandidateForm.jsx
import React, { useState } from 'react';
import { useCandidateForm } from '../hooks/useCandidateForm';

const AddCandidateForm = () => {
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit
  } = useCandidateForm();

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
};

export default AddCandidateForm;
```

#### Hooks Personalizados
```jsx
// hooks/useCandidateForm.js
import { useState } from 'react';
import { candidateService } from '../services/candidateService';

export const useCandidateForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await candidateService.create(formData);
      // Manejar éxito
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange: (name, value) => setFormData(prev => ({ ...prev, [name]: value })),
    handleSubmit
  };
};
```

## 🧪 Testing

### Estrategia de Testing

#### Backend Tests
```typescript
// tests/services/candidateService.test.ts
import { createCandidate } from '../../src/application/services/candidateService';

describe('CandidateService', () => {
  describe('createCandidate', () => {
    it('should create a candidate successfully', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@test.com'
      };

      const result = await createCandidate(candidateData);

      expect(result.id).toBeDefined();
      expect(result.firstName).toBe('Juan');
      expect(result.email).toBe('juan.perez@test.com');
    });

    it('should throw error for invalid email', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'invalid-email'
      };

      await expect(createCandidate(candidateData)).rejects.toThrow('Invalid email');
    });
  });
});
```

#### Frontend Tests
```jsx
// tests/components/AddCandidateForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddCandidateForm from '../components/AddCandidateForm';

describe('AddCandidateForm', () => {
  it('renders form fields', () => {
    render(<AddCandidateForm />);
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('shows validation errors', async () => {
    render(<AddCandidateForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
    
    expect(await screen.findByText(/nombre es requerido/i)).toBeInTheDocument();
  });
});
```

### Comandos de Testing

```bash
# Backend tests
cd backend
npm test                    # Ejecutar todos los tests
npm run test:watch         # Ejecutar tests en modo watch
npm run test:coverage      # Ejecutar tests con coverage

# Frontend tests
cd frontend
npm test                    # Ejecutar todos los tests
npm run test:coverage      # Ejecutar tests con coverage
```

## 📊 Debugging

### Backend Debugging

#### Configuración de VS Code
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

#### Logs Estructurados
```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error);
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, meta);
    }
  }
};
```

### Frontend Debugging

#### React Developer Tools
- Instalar React Developer Tools
- Usar Redux DevTools para state management

#### Console Debugging
```jsx
// Debugging en componentes
const AddCandidateForm = () => {
  const [formData, setFormData] = useState({});
  
  // Debug: Ver cambios en formData
  console.log('FormData changed:', formData);
  
  return (
    // JSX del componente
  );
};
```

## 🚀 Deployment

### Preparación para Producción

#### Backend
```bash
# Construir aplicación
npm run build

# Verificar build
npm run start:prod

# Ejecutar tests de producción
npm run test:prod
```

#### Frontend
```bash
# Crear build de producción
npm run build

# Servir build localmente para pruebas
npx serve -s build
```

### Variables de Entorno

#### Backend (.env)
```env
# Production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/lti_prod
PORT=3010

# Security
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# File Upload
UPLOAD_DIR=/var/uploads
MAX_FILE_SIZE=10485760
```

#### Frontend (.env)
```env
# Production
REACT_APP_API_URL=https://api.lti.com
REACT_APP_ENVIRONMENT=production
```

## 🔍 Monitoreo y Logging

### Health Checks
```typescript
// routes/health.ts
export const healthCheck = (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  });
};
```

### Métricas
```typescript
// utils/metrics.ts
export const trackApiCall = (endpoint: string, method: string, duration: number) => {
  logger.info('API Call', {
    endpoint,
    method,
    duration,
    timestamp: new Date().toISOString()
  });
};
```

## 📚 Recursos Adicionales

### Documentación Externa
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Herramientas Recomendadas
- **API Testing**: Thunder Client, Postman, Insomnia
- **Database**: pgAdmin, DBeaver
- **Monitoring**: Sentry, LogRocket
- **CI/CD**: GitHub Actions, Jenkins

### Mejores Prácticas
1. **Siempre escribir tests** para nuevas funcionalidades
2. **Documentar** cambios en la API
3. **Validar** entrada de datos en frontend y backend
4. **Usar TypeScript** para type safety
5. **Implementar logging** estructurado
6. **Revisar código** antes de hacer merge

---

**Nota**: Esta guía está en constante evolución. Contribuye con mejoras y actualizaciones según las necesidades del proyecto. 