# Guía de Buenas Prácticas Proyecto LTI

## 1. Domain-Driven Design (DDD)

El **Diseño Guiado por el Dominio (DDD)** es una metodología que se enfoca en modelar el software según la lógica del negocio y el dominio. Al centrar el desarrollo en una comprensión profunda del dominio, DDD facilita la creación de sistemas complejos.

### Ventajas

- **Mejora la comunicación:** Promueve un lenguaje común entre desarrolladores y expertos en el dominio, mejorando la comunicación y reduciendo errores de interpretación.
- **Modelos de dominio claros:** Ayuda a construir modelos que reflejan fielmente las reglas y procesos del negocio.
- **Alta mantenibilidad:** Al dividir el sistema en subdominios, facilita el mantenimiento y la evolución del software.

### Componentes clave

#### Entidades: Objetos con identidad distintiva

**Antes:**

```js
// Anteriormente, los datos del candidato podrían haber sido manejados como un simple objeto JSON sin métodos.
const candidate = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
};
```

**Después:**

```ts
export class Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    // Constructor y métodos que encapsulan la lógica de negocio.
    constructor(data: any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
    }
}
```

> **Explicación:**\
> `Candidate` es una entidad ya que tiene un identificador único (`id`) que lo distingue de otros candidatos, incluso si otras propiedades son idénticas.

---

#### Value Objects: Objetos que describen aspectos del dominio sin identidad conceptual

**Antes:**

```js
// Manejo de información de educación como un simple objeto.
const education = {
    institution: 'University',
    degree: 'Bachelor',
    startDate: '2010-01-01',
    endDate: '2014-01-01'
};
```

**Después:**

```ts
export class Education {
    institution: string;
    title: string;
    startDate: Date;
    endDate?: Date;
    constructor(data: any) {
        this.institution = data.institution;
        this.title = data.title;
        this.startDate = new Date(data.startDate);
        this.endDate = data.endDate ? new Date(data.endDate) : undefined;
    }
}
```

> **Explicación:**\
> `Education` puede considerarse un Value Object en algunos contextos, ya que describe la educación de un candidato sin necesidad de un identificador único que lo defina por sí mismo.

> **Clarificación y Uso Correcto de Value Objects:**\
> Actualmente, algunas clases como `Education` y `WorkExperience` tienen identificadores únicos, lo que las clasifica como entidades. Sin embargo, en muchos casos, estos podrían ser tratados como Value Objects dentro del contexto de un `Candidate`.

**Mejora Propuesta:**

- Eliminar los identificadores únicos de las clases que deberían ser Value Objects.
- Incorporarlas como parte de los documentos de `Candidate` (NoSQL) o mantenerlas en tablas separadas pero sin tratarlas como entidades independientes en el dominio.

---

#### Agregados: Conjuntos de objetos que deben ser tratados como una unidad

**Antes:**

```js
// Datos del candidato y su educación manejados por separado.
const candidate = { id: 1, name: 'John Doe' };
const educations = [{ candidateId: 1, institution: 'University' }];
```

**Después:**

```ts
export class Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    educations: Education[];
    constructor(data: any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.educations = data.educations.map(edu => new Education(edu));
    }
}
```

> **Explicación:**\
> `Candidate` actúa como un agregado que contiene `Education`, `WorkExperience`, `Resume`, y `Application`. `Candidate` es la raíz del agregado.

**Recomendación:**\
Los agregados deben ser diseñados cuidadosamente para garantizar la consistencia interna.

**Mejora Propuesta:**

- Revisar y limitar las operaciones que modifican objetos dentro del agregado de `Candidate`.
- Operaciones que afectan a `Education` y `WorkExperience` deben ser manejadas a través de la raíz del agregado.

---

#### Repositorios: Interfaces para acceso a agregados y entidades

**Antes:**

```js
// Acceso directo a la base de datos sin abstracción.
function getCandidateById(id) {
    return database.query('SELECT * FROM candidates WHERE id = ?', [id]);
}
```

**Después:**

```ts
export class CandidateRepository {
    async findById(id: number): Promise<Candidate | null> {
        const data = await prisma.candidate.findUnique({ where: { id } });
        return data ? new Candidate(data) : null;
    }
}
```

> **Explicación:**\
> `CandidateRepository` proporciona una interfaz clara para acceder a los datos de los candidatos.

**Mejora Propuesta:**

- Desarrollar interfaces de repositorio completas para cada entidad y agregado.

---

#### Servicios de Dominio: Lógica de negocio fuera de entidades/valores

**Antes:**

```js
// Funciones sueltas para manejar la lógica de negocio.
function calculateAge(candidate) {
    const today = new Date();
    const birthDate = new Date(candidate.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
```

**Después:**

```ts
export class CandidateService {
    static calculateAge(candidate: Candidate): number {
        const today = new Date();
        const birthDate = new Date(candidate.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
```

> **Explicación:**\
> `CandidateService` encapsula la lógica de negocio relacionada con los candidatos.

---

### Otras recomendaciones

#### Uso de Factories

- Encapsular la lógica de creación de objetos complejos.
- **Mejora Propuesta:** Implementar factories para la creación de entidades y agregados complejos.

#### Mejora en la Modelación de Relaciones

- Revisar y posiblemente rediseñar las relaciones entre entidades para asegurar que reflejen las reglas del dominio.

#### Integración de Eventos de Dominio

- **Mejora Propuesta:** Implementar un sistema de eventos de dominio para manejar efectos secundarios de manera desacoplada.

---

## 2. Principios SOLID y DRY

### SOLID

**Cinco principios para diseño orientado a objetos:**

#### S - Single Responsibility Principle (SRP)

Cada clase debe tener una única responsabilidad.

**Antes:**

```js
function processCandidate(candidate) {
    if (!candidate.email.includes('@')) {
        console.error('Email inválido');
        return;
    }
    database.save(candidate);
    console.log('Candidato guardado');
}
```

**Después:**

```ts
export class Candidate {
    validateEmail() {
        if (!this.email.includes('@')) {
            throw new Error('Email inválido');
        }
    }

    save() {
        this.validateEmail();
        prisma.candidate.create(this);
    }
}
```

> **Explicación:**\
> Métodos separados para validar email y guardar información.

---

#### O - Open/Closed Principle (OCP)

Las entidades deben estar abiertas para extensión, pero cerradas para modificación.

**Antes:**

```js
class Candidate {
    saveToDatabase() {
        // código
    }
    sendEmail() {
        // código
    }
}
```

**Después:**

```ts
export class Candidate {
    saveToDatabase() {
        // código para guardar
    }
}
// Extendemos la funcionalidad sin modificar la clase existente.
class CandidateWithEmail extends Candidate {
    sendEmail() {
        // código para enviar email
    }
}
```

> **Explicación:**\
> Funcionalidad extendida con subclases.

---

#### L - Liskov Substitution Principle (LSP)

Objetos derivados deben ser reemplazables por objetos de la clase base.

**Antes:**

```js
class TemporaryCandidate extends Candidate {
    saveToDatabase() {
        throw new Error("Temporary candidates can't be saved.");
    }
}
```

**Después:**

```js
class TemporaryCandidate extends Candidate {
    saveToDatabase() {
        // Implementación adecuada
        console.log("Handled temporarily");
    }
}
```

> **Explicación:**\
> La subclase respeta el contrato de la clase base.

---

#### I - Interface Segregation Principle (ISP)

Mejor muchas interfaces pequeñas que una sola grande.

**Antes:**

```ts
interface CandidateOperations {
    save();
    validate();
    sendEmail();
    generateReport();
}
```

**Después:**

```ts
interface SaveOperation { save(); }
interface EmailOperations { sendEmail(); }
interface ReportOperations { generateReport(); }

class Candidate implements SaveOperation, EmailOperations {
    save() { /* ... */ }
    sendEmail() { /* ... */ }
}
```

> **Explicación:**\
> Interfaces segregadas para operaciones específicas.

---

#### D - Dependency Inversion Principle (DIP)

Módulos de alto nivel no deben depender de módulos de bajo nivel.

**Antes:**

```ts
class Candidate {
    private database = new MySQLDatabase();
    save() {
        this.database.save(this);
    }
}
```

**Después:**

```ts
interface Database {
    save(candidate: Candidate);
}

class Candidate {
    private database: Database;
    constructor(database: Database) {
        this.database = database;
    }
    save() {
        this.database.save(this);
    }
}
```

> **Explicación:**\
> `Candidate` depende de una abstracción, no de una implementación concreta.

---

### DRY (Don't Repeat Yourself)

Reducir la duplicación de código.

**Antes:**

```js
function saveCandidate(candidate) {
    if (!candidate.email.includes('@')) {
        throw new Error('Email inválido');
    }
    // guardar lógica
}

function updateCandidate(candidate) {
    if (!candidate.email.includes('@')) {
        throw new Error('Email inválido');
    }
    // actualizar lógica
}
```

**Después:**

```ts
export class Candidate {
    validateEmail() {
        if (!this.email.includes('@')) {
            throw new Error('Email inválido');
        }
    }
    save() {
        this.validateEmail();
        // guardar lógica
    }
    update() {
        this.validateEmail();
        // actualizar lógica
    }
}
```

> **Explicación:**\
> La validación se centraliza en un solo método.

---

## 3. Patrones de Diseño

Los patrones de diseño son soluciones reutilizables a problemas comunes en el desarrollo de software.

### Patrones Comunes

#### Singleton

Garantiza que una clase tenga solo una instancia.

**Antes:**

```ts
// Candidate.ts
const prisma = new PrismaClient();
// Resume.ts
const prisma = new PrismaClient();
```

**Después:**

```ts
// Candidate.ts
import prisma from '../prismaClientInstance';
// Resume.ts
import prisma from '../prismaClientInstance';
// Usar 'prisma' en lugar de crear una nueva instancia
```

> **Explicación:**\
> El `PrismaClient` se instancia una sola vez y se importa donde sea necesario.

---

#### Factory

Crea objetos sin especificar la clase exacta a crear.

**Antes:**

```ts
const candidate = new Candidate(candidateData);
```

**Después:**

```ts
class ModelFactory {
    static createModel(modelName: string, data: any) {
        switch (modelName) {
            case 'Candidate':
                return new Candidate(data);
            case 'Education':
                return new Education(data);
            // otros casos
            default:
                throw new Error('Tipo de modelo desconocido');
        }
    }
}
// Uso
const candidate = ModelFactory.createModel('Candidate', candidateData);
```

> **Explicación:**\
> Permite una creación flexible y centralizada de objetos.

---

#### Observer

Permite notificar a otros objetos sobre cambios de estado.

**Ejemplo:**

```ts
interface Observer {
    update(subject: Subject): void;
}

interface Subject {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify(): void;
}

class CandidateApplication implements Subject {
    private observers: Observer[] = [];
    attach(observer: Observer) { this.observers.push(observer); }
    detach(observer: Observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) this.observers.splice(index, 1);
    }
    notify() { for (const observer of this.observers) observer.update(this); }
    updateApplicationStatus(status: string) {
        // Lógica de actualización aquí
        this.notify();
    }
}
```

> **Explicación:**\
> Permite reaccionar a cambios en los estados, como notificar a RRHH o al candidato.

---

#### Strategy

Permite definir una familia de algoritmos, encapsularlos y hacerlos intercambiables.

**Antes:**

```ts
// validator.ts
validateName(data.firstName);
```

**Después:**

```ts
interface ValidationStrategy {
    validate(data: any): void;
}
class NameValidationStrategy implements ValidationStrategy {
    validate(data: any) {
        // Lógica de validación de nombre
    }
}
class ValidatorContext {
    private strategy: ValidationStrategy;
    constructor(strategy: ValidationStrategy) { this.strategy = strategy; }
    validate(data: any) { this.strategy.validate(data); }
}
// Uso
const nameValidator = new ValidatorContext(new NameValidationStrategy());
nameValidator.validate(candidateData.firstName);
```

> **Explicación:**\
> Hace la lógica de validación intercambiable y extensible.

---

Estas recomendaciones tienen como objetivo mejorar la **flexibilidad**, **mantenibilidad** y **escalabilidad** de la aplicación mediante el uso de **patrones de diseño** bien conocidos.

