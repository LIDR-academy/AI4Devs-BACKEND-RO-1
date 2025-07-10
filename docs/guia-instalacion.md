# Guía de Instalación - LTI Talent Tracking System

## 🚀 Requisitos Previos

### Software Necesario

| Software | Versión Mínima | Versión Recomendada | Descarga |
|----------|----------------|---------------------|----------|
| Node.js | 16.x | 18.x+ | [nodejs.org](https://nodejs.org/) |
| npm | 8.x | 9.x+ | (incluido con Node.js) |
| Docker | 20.x | 24.x+ | [docker.com](https://www.docker.com/) |
| Docker Compose | 2.x | 2.x+ | (incluido con Docker Desktop) |
| Git | 2.x | 2.x+ | [git-scm.com](https://git-scm.com/) |

### Verificación del Sistema

```bash
# Verificar versiones instaladas
node --version     # debe mostrar v18.x.x o superior
npm --version      # debe mostrar 9.x.x o superior
docker --version   # debe mostrar 24.x.x o superior
docker-compose --version  # debe mostrar 2.x.x o superior
git --version      # debe mostrar 2.x.x o superior
```

## 📦 Instalación paso a paso

### 1. Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/AI4Devs-BACKEND-RO-1.git

# Navegar al directorio del proyecto
cd AI4Devs-BACKEND-RO-1

# Verificar la estructura del proyecto
ls -la
```

### 2. Configurar Variables de Entorno

#### Backend
```bash
# Navegar al directorio backend
cd backend

# Crear archivo .env basado en .env.example (si existe)
cp .env.example .env

# O crear el archivo .env manualmente
touch .env
```

**Contenido del archivo `backend/.env`:**
```env
# Database Configuration
DATABASE_URL="postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5432/LTIdb"

# Database Connection Details (for docker-compose)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=LTIdb
DB_USER=LTIdbUser
DB_PASSWORD=D1ymf8wyQEGthFR1E9xhCq

# Server Configuration
NODE_ENV=development
PORT=3010

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

#### Variables de Entorno Raíz
```bash
# Regresar al directorio raíz
cd ..

# Crear archivo .env en la raíz (para docker-compose)
touch .env
```

**Contenido del archivo `.env` (raíz):**
```env
# Database Configuration for Docker Compose
DB_NAME=LTIdb
DB_USER=LTIdbUser
DB_PASSWORD=D1ymf8wyQEGthFR1E9xhCq
DB_PORT=5432
```

### 3. Instalar Dependencias

#### Backend
```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Verificar instalación
npm list --depth=0
```

#### Frontend
```bash
# Navegar al directorio frontend
cd ../frontend

# Instalar dependencias
npm install

# Verificar instalación
npm list --depth=0
```

### 4. Configurar Base de Datos

#### Levantar PostgreSQL con Docker

```bash
# Regresar al directorio raíz
cd ..

# Levantar el contenedor de PostgreSQL
docker-compose up -d

# Verificar que el contenedor esté corriendo
docker ps

# Ver logs del contenedor (opcional)
docker-compose logs db
```

#### Configurar Prisma y Base de Datos

```bash
# Navegar al directorio backend
cd backend

# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones (crear tablas)
npx prisma migrate dev

# Poblar la base de datos con datos iniciales
npx ts-node prisma/seed.ts
```

### 5. Crear Directorio de Uploads

```bash
# Desde el directorio backend
mkdir -p uploads

# Dar permisos apropiados (Linux/Mac)
chmod 755 uploads
```

## 🔧 Configuración Avanzada

### Configuración de Base de Datos Personalizada

Si deseas usar una configuración diferente de PostgreSQL:

```bash
# Editar docker-compose.yml
vim docker-compose.yml
```

```yaml
version: "3.1"

services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_PASSWORD: tu_password_personalizada
      POSTGRES_USER: tu_usuario_personalizado
      POSTGRES_DB: tu_base_de_datos
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Configuración de Prisma

Si cambias la configuración de base de datos, actualiza el archivo `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Y actualiza tu `DATABASE_URL` en `.env`:
```env
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/tu_base_de_datos"
```

## 🚀 Ejecutar la Aplicación

### Modo Desarrollo

#### Terminal 1 - Backend
```bash
# Navegar al directorio backend
cd backend

# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en http://localhost:3010
```

#### Terminal 2 - Frontend
```bash
# Navegar al directorio frontend
cd frontend

# Iniciar servidor de desarrollo
npm start

# La aplicación estará disponible en http://localhost:3000
```

### Modo Producción

#### Backend
```bash
# Navegar al directorio backend
cd backend

# Compilar TypeScript
npm run build

# Iniciar servidor de producción
npm start
```

#### Frontend
```bash
# Navegar al directorio frontend
cd frontend

# Crear build de producción
npm run build

# Servir archivos estáticos (usando serve)
npx serve -s build -l 3000
```

## 🧪 Verificación de la Instalación

### 1. Verificar Backend

```bash
# Probar endpoint básico
curl http://localhost:3010/

# Debería retornar: "Hola LTI!"
```

### 2. Verificar Base de Datos

```bash
# Conectar a PostgreSQL
docker exec -it $(docker ps -q --filter "ancestor=postgres") psql -U LTIdbUser -d LTIdb

# Verificar tablas
\dt

# Verificar datos de ejemplo
SELECT * FROM "Candidate" LIMIT 5;

# Salir
\q
```

### 3. Verificar Frontend

1. Abrir navegador en `http://localhost:3000`
2. Verificar que carga el Dashboard del Reclutador
3. Probar navegación a "Añadir Candidato"

### 4. Prueba End-to-End

```bash
# Crear un candidato usando curl
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

## 🐛 Solución de Problemas

### Problemas Comunes

#### 1. Error de Conexión a la Base de Datos
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Si no está corriendo, levantarlo
docker-compose up -d db

# Verificar logs
docker-compose logs db
```

#### 2. Puerto ya en uso
```bash
# Verificar qué proceso usa el puerto 3010
lsof -i :3010

# Matar proceso si es necesario
kill -9 <PID>

# O cambiar puerto en backend/.env
PORT=3011
```

#### 3. Errores de Prisma
```bash
# Regenerar cliente de Prisma
npx prisma generate

# Resetear base de datos (¡CUIDADO: borra todos los datos!)
npx prisma migrate reset

# Ejecutar migraciones nuevamente
npx prisma migrate dev
```

#### 4. Problemas con dependencias
```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 5. Errores de TypeScript
```bash
# Verificar configuración de TypeScript
npx tsc --noEmit

# Verificar versión de TypeScript
npx tsc --version
```

### Logs y Debugging

#### Backend
```bash
# Ver logs del servidor
npm run dev

# Modo debug con más información
DEBUG=* npm run dev
```

#### Frontend
```bash
# Abrir DevTools en navegador
# Verificar Console y Network tabs
```

#### Base de Datos
```bash
# Ver logs de PostgreSQL
docker-compose logs db

# Conectar directamente a la base de datos
docker exec -it $(docker ps -q --filter "ancestor=postgres") psql -U LTIdbUser -d LTIdb
```

## 🔐 Configuración de Seguridad

### Variables de Entorno Seguras

```bash
# Generar secretos seguros
openssl rand -base64 32

# Usar en .env
JWT_SECRET=<secreto_generado>
SESSION_SECRET=<otro_secreto_generado>
```

### Configuración de CORS

En `backend/src/index.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## 📋 Checklist de Instalación

- [ ] Node.js y npm instalados
- [ ] Docker y Docker Compose instalados
- [ ] Repositorio clonado
- [ ] Variables de entorno configuradas
- [ ] Dependencias del backend instaladas
- [ ] Dependencias del frontend instaladas
- [ ] PostgreSQL corriendo en Docker
- [ ] Base de datos migrada
- [ ] Datos de ejemplo cargados
- [ ] Backend corriendo en puerto 3010
- [ ] Frontend corriendo en puerto 3000
- [ ] Prueba end-to-end exitosa

## 🎯 Siguientes Pasos

Una vez completada la instalación:

1. **Explorar la aplicación**: Navegar por la interfaz y probar funcionalidades
2. **Revisar documentación**: Leer [arquitectura.md](./arquitectura.md) para entender el diseño
3. **Desarrollo**: Consultar [guia-desarrollo.md](./guia-desarrollo.md) para mejores prácticas
4. **API**: Revisar [api-reference.md](./api-reference.md) para documentación de endpoints

---

**¿Problemas durante la instalación?** Consulta la sección de solución de problemas o crea un issue en el repositorio del proyecto. 