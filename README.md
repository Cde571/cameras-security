# technological-cameras

Sistema de gestión comercial desarrollado con **Astro + React + TypeScript** para administrar **clientes, productos, cotizaciones, órdenes de trabajo, actas, cuentas de cobro, pagos, reportes y configuración**, con soporte para **PDFs profesionales** y una arquitectura preparada para conectarse a **PostgreSQL + Drizzle ORM**.

---

## Tabla de contenido

- [Descripción](#descripción)
- [Objetivo del proyecto](#objetivo-del-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Características principales](#características-principales)
- [Estado actual del proyecto](#estado-actual-del-proyecto)
- [Arquitectura general](#arquitectura-general)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos del sistema](#módulos-del-sistema)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos](#base-de-datos)
- [Scripts disponibles](#scripts-disponibles)
- [Flujo general de la aplicación](#flujo-general-de-la-aplicación)
- [Generación de PDFs](#generación-de-pdfs)
- [Autenticación](#autenticación)
- [Servicios locales y servicios API](#servicios-locales-y-servicios-api)
- [Roadmap / Pendientes](#roadmap--pendientes)
- [Problemas comunes](#problemas-comunes)
- [Licencia](#licencia)

---

## Descripción

`technological-cameras` es una aplicación web orientada a la gestión de operaciones comerciales y documentales para una empresa de soluciones tecnológicas, seguridad o videovigilancia.

El sistema permite administrar el flujo completo de trabajo desde la creación del cliente hasta la generación de documentos y el seguimiento financiero:

- registro de clientes
- catálogo de productos y kits
- creación de cotizaciones
- generación de órdenes de trabajo
- elaboración de actas de entrega
- emisión de cuentas de cobro
- registro de pagos y cartera
- reportes y configuración general del sistema

---

## Objetivo del proyecto

Construir una plataforma moderna, modular y escalable para digitalizar el flujo comercial y operativo de una empresa, permitiendo:

- centralizar la información
- reducir trabajo manual
- generar documentos profesionales en PDF
- facilitar el seguimiento del proceso comercial
- preparar el proyecto para una migración progresiva desde `localStorage` a una base de datos real con API

---

## Stack tecnológico

### Frontend
- **Astro**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **lucide-react**

### Backend / Persistencia
- **Astro API Routes**
- **PostgreSQL**
- **Drizzle ORM**
- **dotenv**

### Documentos / Utilidades
- **pdf-lib** para generación de PDFs
- **xlsx** para importación/exportación Excel
- **localStorage** como capa local temporal para desarrollo

---

## Características principales

- Dashboard principal con métricas y accesos rápidos
- Gestión de clientes
- Gestión de productos, categorías y kits
- Módulo completo de cotizaciones
- Vista previa y descarga de PDF de cotizaciones
- Gestión de órdenes de trabajo
- Gestión de actas de entrega
- Gestión de cuentas de cobro
- Registro de pagos y control de cartera
- Reportes comerciales
- Configuración de empresa, impuestos y numeración
- Estructura lista para autenticación y base de datos real

---

## Estado actual del proyecto

### Ya implementado o avanzado
- estructura general del proyecto
- layouts y navegación
- login base
- dashboard
- módulo de clientes
- módulo de productos
- módulo de cotizaciones
- módulo de órdenes
- módulo de actas
- módulo de cobros
- módulo de reportes
- generador PDF de cotización
- esquema inicial de base de datos con Drizzle

### En progreso / pendiente de cierre
- conexión completa a base de datos real
- endpoints API de todos los módulos
- integración total entre módulos
- stores globales
- algunos componentes base UI
- exportaciones avanzadas
- cierre de flujo end-to-end para producción

---

## Arquitectura general

El proyecto está dividido en capas:

### 1. `pages/`
Contiene las rutas Astro de la aplicación.

### 2. `components/`
Contiene los componentes React por módulo.

### 3. `layouts/`
Layouts reutilizables para páginas autenticadas, login y vistas de impresión.

### 4. `lib/`
Contiene:
- autenticación
- base de datos
- servicios
- utilidades
- PDFs
- Excel

### 5. `stores/`
Espacio para manejo de estado global del frontend.

### 6. `types/`
Tipos TypeScript centralizados por entidad.

---

## Estructura del proyecto

```bash
src/
├── assets/
├── components/
│   ├── actas/
│   ├── auth/
│   ├── clientes/
│   ├── cobros/
│   ├── config/
│   ├── cotizaciones/
│   ├── dashboard/
│   ├── navigation/
│   ├── ordenes/
│   ├── pagos/
│   ├── productos/
│   ├── reportes/
│   └── ui/
├── layouts/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── excel/
│   ├── pdf/
│   ├── services/
│   └── utils/
├── pages/
│   ├── api/
│   ├── actas/
│   ├── auth/
│   ├── clientes/
│   ├── cobros/
│   ├── config/
│   ├── cotizaciones/
│   ├── ordenes/
│   ├── pagos/
│   ├── productos/
│   └── reportes/
├── stores/
├── styles/
└── types/
Módulos del sistema
Auth
login
logout
verificación de sesión (/api/auth/me)
Dashboard
KPIs
documentos recientes
alertas
acciones rápidas
Clientes
listado
creación
edición
historial
exportación
Productos
listado
formulario
categorías
kits
importación
Cotizaciones
creación
edición
versionado
detalle
PDF
plantillas de texto
cálculo de totales
Órdenes
creación
detalle
checklist
evidencias
asignación técnica
Actas
creación
detalle
activos entregados
firma
PDF
Cobros
creación
detalle
servicios asociados
PDF
Pagos
cartera
estado de cuenta
registro de pagos
soportes
Reportes
ventas
clientes
productos
márgenes
dashboard de reportes
Configuración
empresa
impuestos
numeración
usuarios
plantillas
backup
auditoría
Instalación
1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd technological-cameras
2. Instalar dependencias
npm install
3. Ejecutar en desarrollo
npm run dev
Variables de entorno

Crea un archivo .env en la raíz del proyecto.

Ejemplo:

DATABASE_URL=postgres://postgres:postgres@localhost:5432/cotizaciones_db

Ajusta el usuario, contraseña, host y nombre de la base según tu instalación local.

Base de datos

El proyecto está preparado para trabajar con PostgreSQL + Drizzle.

Archivos relacionados
src/lib/db/client.ts
src/lib/db/schema.ts
src/lib/db/migrations.ts
drizzle.config.json o drizzle.config.ts
Flujo recomendado
definir esquema en schema.ts
generar migraciones
aplicarlas a PostgreSQL
conectar los servicios y endpoints
Generar migración
npm run db:generate
Aplicar migraciones
npm run db:migrate
Scripts disponibles
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "tsx src/lib/db/migrations.ts",
  "db:studio": "drizzle-kit studio"
}

Los scripts pueden variar según la configuración final del proyecto.

Flujo general de la aplicación

El flujo ideal del sistema es:

iniciar sesión
configurar empresa/impuestos/numeración
registrar clientes
registrar productos o kits
crear cotización
generar PDF de cotización
crear orden de trabajo
generar acta de entrega
generar cuenta de cobro
registrar pagos
revisar cartera y reportes
Generación de PDFs

La lógica de generación de documentos está en:

src/lib/pdf/cotizacionPDF.ts
src/lib/pdf/cuentaCobroPDF.ts
src/lib/pdf/actaPDF.ts
src/lib/pdf/templates.ts

Las vistas previas se consumen desde componentes como:

src/components/cotizaciones/CotizacionPDF.tsx
src/components/cotizaciones/PDFPreview.tsx
src/components/cobros/PDFPreview.tsx
src/components/actas/PDFPreview.tsx

Las rutas de visualización suelen estar en:

/cotizaciones/[id]/pdf
/cobros/[id]/pdf
/actas/[id]/pdf
Autenticación

Actualmente el proyecto incluye una base para autenticación mediante:

src/pages/api/auth/login.ts
src/pages/api/auth/logout.ts
src/pages/api/auth/me.ts
src/lib/auth/session.ts
src/middleware.ts

En modo desarrollo puede usarse un bypass o un modo sin seguridad, pero para producción se recomienda:

sesión con cookie httpOnly
middleware de protección de rutas
usuario persistido en base de datos
endpoint /api/auth/me estable
Servicios locales y servicios API

La app sigue una estrategia híbrida:

*LocalService.ts

Usa localStorage para desarrollo rápido o modo demo.

*Service.ts

Wrapper pensado para consumir una API real y, mientras tanto, usar fallback local.

Esto permite una transición progresiva desde frontend local a backend real sin romper la estructura del proyecto.

Roadmap / Pendientes
Prioridad alta
conectar PostgreSQL real
completar db/client.ts, schema.ts, migrations.ts
crear endpoints /api/... por módulo
conectar servicios reales a la DB
cerrar autenticación definitiva
Prioridad media
completar stores/
completar types/
completar components/ui/
cerrar reportes reales
cerrar import/export Excel
Prioridad de cierre
limpiar archivos .bak
consolidar el dashboard principal (/ vs /dashboard)
pruebas end-to-end
hardening para producción
Problemas comunes
1. npm run dev falla porque no existe package.json

Asegúrate de estar en la raíz correcta del proyecto y que el proyecto haya sido inicializado correctamente.

2. Falta DATABASE_URL en el .env

Crea el archivo .env y define:

DATABASE_URL=postgres://postgres:postgres@localhost:5432/cotizaciones_db
3. drizzle.config.json file does not exist

Debes crear el archivo de configuración de Drizzle en la raíz del proyecto.

4. Unexpected token '/' in drizzle.config.json

El archivo .json no admite comentarios. Usa JSON puro o cambia a drizzle.config.ts.

5. PowerShell da errores con mkdir -p o cat << EOF

Eso ocurre porque esos comandos son de Bash, no de PowerShell. Usa scripts .ps1 nativos para Windows.

Licencia

Uso interno / privado.
Define aquí la licencia final del proyecto si luego lo vas a publicar o distribuir.

Autor

Desarrollado por Cristian Echeverry
Proyecto: technological-cameras


Si quieres, te lo puedo dejar ahora en una **versión más profesional/corporativa** o en una **versión más técnica para GitHub**.
