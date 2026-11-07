# Agroindustrial Backend

Backend REST para la captación y administración de prospectos, contactos y eventos de analítica de una plataforma web agroindustrial. El proyecto organiza la información recibida desde formularios y puntos de contacto, la persiste en PostgreSQL y deja preparada una capa para conectar servicios externos de marketing.

> **Estado del proyecto:** base funcional en desarrollo. Los módulos de leads, contactos y analítica cuentan con endpoints implementados. La capa de integraciones externas es actualmente una estructura preparada para futuras conexiones; no se deben considerar activas integraciones reales con Meta o Google.

## Objetivo

Centralizar la información que llega desde los canales digitales de una empresa agroindustrial para:

- Registrar prospectos y datos de contacto.
- Conservar parámetros UTM y contexto de origen de las visitas.
- Relacionar eventos de interacción con prospectos cuando existe coincidencia por correo o teléfono.
- Mantener un modelo de datos que permita ampliar posteriormente la analítica y las integraciones de marketing.

## Funcionalidades implementadas

| Módulo | Responsabilidad |
| --- | --- |
| Leads | Crear prospectos y actualizar registros existentes cuando coincide el correo electrónico. |
| Contacts | Recibir formularios de contacto, registrar contexto de la solicitud y coordinar el flujo de procesamiento. |
| Analytics | Registrar eventos y asociarlos con un lead cuando se proporciona su correo o teléfono. |
| Integrations | Exponer una capa de despacho preparada para futuras integraciones externas. Actualmente utiliza registros de consola y no envía datos a proveedores reales. |
| Persistence | Gestionar el acceso a PostgreSQL mediante Prisma ORM. |

### Flujo general de un formulario

1. El cliente envía los datos a `POST /contacts`.
2. El módulo de contactos busca o registra el prospecto.
3. Se registra el evento `contact_submit` en analítica.
4. Se invoca la capa de despacho de integraciones, actualmente preparada como punto de extensión.
5. La API responde con el identificador del lead asociado.

## Tecnologías

- **Node.js y TypeScript**
- **NestJS 11** — estructura modular y controladores REST.
- **PostgreSQL 15** — base de datos relacional.
- **Prisma ORM 7** — esquema, cliente y migraciones.
- **class-validator / class-transformer** — validación y transformación de DTO.
- **Docker Compose** — entorno local de PostgreSQL.
- **Jest y Supertest** — herramientas configuradas para pruebas.

## Arquitectura y organización

La aplicación utiliza una arquitectura modular de NestJS. Cada dominio mantiene sus controladores, servicios y módulos; el acceso a datos se centraliza en Prisma.

```text
src/
├── analytics/
│   ├── dto/
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   └── analytics.module.ts
├── contacts/
│   ├── dto/
│   ├── contacts.controller.ts
│   ├── contacts.service.ts
│   └── contacts.module.ts
├── leads/
│   ├── leads.controller.ts
│   ├── leads.service.ts
│   └── leads.module.ts
├── integrations/
│   ├── integrations.service.ts
│   └── integrations.module.ts
├── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── dto/
├── app.module.ts
└── main.ts

prisma/
├── migrations/
└── schema.prisma

test/
└── app.e2e-spec.ts
```

## Modelo de datos

El esquema Prisma contempla las siguientes entidades:

- **Lead:** prospecto, información de contacto, origen, parámetros UTM, estado de seguimiento, notas y metadatos.
- **Contact:** registro de contacto con datos de atribución, contexto de la solicitud y estado.
- **Event:** evento de interacción con tipo, payload JSON opcional y relación opcional con un lead.
- **Product:** estructura básica para información de productos.

La relación principal de analítica es `Lead 1 — N Event`. El esquema y las migraciones versionadas se encuentran en `prisma/`.

## API disponible

La aplicación escucha por defecto en el puerto **3001** (configurable mediante `PORT`).

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/lead` | Crea un lead o actualiza el existente cuando coincide el correo. |
| POST | `/contacts` | Procesa un formulario de contacto y registra el evento asociado. |
| POST | `/track` | Registra un evento de analítica. |
| POST | `/identify` | Identifica o actualiza un lead a partir de sus datos. |

### Ejemplos de solicitudes

**Crear un lead**

```http
POST /lead
Content-Type: application/json
```

```json
{
  "name": "María López",
  "email": "maria@example.com",
  "phone": "4421234567",
  "source": "landing",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "productos-agro"
}
```

**Enviar un formulario de contacto**

```http
POST /contacts
Content-Type: application/json
```

```json
{
  "name": "María López",
  "email": "maria@example.com",
  "phone": "4421234567",
  "source": "website",
  "utm_source": "facebook",
  "utm_campaign": "contacto"
}
```

**Registrar un evento**

```http
POST /track
Content-Type: application/json
```

```json
{
  "type": "whatsapp_click",
  "leadEmail": "maria@example.com",
  "data": {
    "page": "/contacto",
    "campaign": "productos-agro"
  }
}
```

> Los ejemplos son ilustrativos. La API aplica un `ValidationPipe` global con `whitelist` y `transform`. Actualmente no incluye autenticación ni autorización; no debe exponerse como servicio productivo sin implementar controles de acceso, protección de datos y límites de uso.

## Requisitos previos

- Node.js compatible con las dependencias del proyecto.
- npm.
- Docker Desktop o Docker Engine con Docker Compose.
- Git.

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/yafAram/agroindustrial-backend.git
cd agroindustrial-backend
npm install
```

### 2. Levantar PostgreSQL

```bash
docker compose up -d postgres
```

El archivo actual de Docker Compose configura PostgreSQL 15, la base `agrodb` y el puerto local `5432`. Sus credenciales predeterminadas son únicamente para desarrollo local: cámbialas antes de cualquier despliegue y no reutilices esos valores en producción.

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agrodb?schema=public"
```

Ajusta la cadena de conexión si cambiaste el usuario, contraseña, host o puerto de PostgreSQL. No subas el archivo `.env` al repositorio.

### 4. Generar Prisma Client y aplicar migraciones

```bash
npm run prisma:generate
npx prisma migrate deploy
```

Para crear y aplicar una migración durante el desarrollo del esquema:

```bash
npm run prisma:migrate
```

### 5. Iniciar la API

```bash
npm run start:dev
```

La API quedará disponible en:

```text
http://localhost:3001
```

Para compilar y ejecutar la versión compilada:

```bash
npm run build
npm run start:prod
```

## Pruebas y calidad

Los scripts de pruebas están configurados con Jest y Supertest:

```bash
npm test
npm run test -- --coverage
```

La configuración actual contiene pruebas base de NestJS. La cobertura funcional de los flujos de negocio debe ampliarse; no se presenta este repositorio como si ya contara con una suite completa de pruebas automatizadas.

## Trabajo colaborativo y control de versiones

Este repositorio es un **fork** del proyecto original [VaneeeSosa/agroindustrial-backend](https://github.com/VaneeeSosa/agroindustrial-backend). Se conserva esa relación para mantener la atribución y el contexto del trabajo colaborativo.

El historial de Git permite identificar contribuciones de ambas cuentas. En particular, el historial registra una contribución de **yafAram** relacionada con resolución de dependencias, ajustes de configuración de TypeScript, correcciones de lógica y habilitación de endpoints. También registra contribuciones previas de **VaneeeSosa**, incluyendo trabajo de preparación y configuración de Prisma. Esta descripción se limita a lo que puede respaldarse con el historial público del repositorio.

### Estrategia de ramas

- `main`: rama principal con la versión de referencia del proyecto.
- `pruebas`: rama destinada a experimentar, validar cambios y desarrollar pruebas antes de integrar modificaciones a `main`.

Flujo sugerido para nuevas contribuciones:

1. Actualizar la rama `pruebas`.
2. Crear una rama de trabajo descriptiva, por ejemplo `feature/lead-validation` o `fix/contact-flow`.
3. Implementar el cambio y ejecutar las pruebas disponibles.
4. Abrir un Pull Request hacia `main`, describiendo el objetivo, los cambios y la validación realizada.
5. Revisar y fusionar únicamente cuando el cambio esté listo.

## Alcance actual y siguientes mejoras

El repositorio representa una base de backend colaborativa en evolución. Entre las mejoras pendientes recomendadas se encuentran:

- Incorporar autenticación, autorización y protección de endpoints.
- Endurecer la configuración de PostgreSQL y separar secretos por entorno.
- Ampliar pruebas unitarias y de integración para leads, contactos y eventos.
- Reforzar los tipos de datos de los servicios y payloads.
- Definir políticas de retención y protección de datos personales.
- Implementar y probar integraciones reales mediante webhooks o proveedores externos.
- Documentar respuestas de error, códigos HTTP y contratos definitivos de cada endpoint.

## Colaboradores

- [yafAram](https://github.com/yafAram)
- [VaneeeSosa](https://github.com/VaneeeSosa)

---

**Nota:** este repositorio documenta un proyecto de desarrollo colaborativo y una base técnica en evolución. Las funcionalidades descritas corresponden al código disponible; las integraciones marcadas como futuras y las mejoras pendientes no se presentan como funcionalidades terminadas.
