# Estructura del Proyecto - Sistema de Cotizaciones

## 📁 Estructura de Directorios

### `/src/components`
Componentes React/Vue organizados por módulo:
- `ui/` - Componentes base reutilizables
- `navigation/` - Menú, header, breadcrumbs
- `dashboard/` - Widgets del dashboard
- `clientes/` - Gestión de clientes
- `productos/` - Catálogo y kits
- `cotizaciones/` - Constructor de cotizaciones
- `ordenes/` - Órdenes de trabajo
- `actas/` - Actas de entrega
- `cobros/` - Cuentas de cobro
- `pagos/` - Registro de pagos y cartera
- `reportes/` - Gráficos y exportaciones
- `config/` - Configuración del sistema

### `/src/pages`
Rutas de Astro organizadas por módulo con estructura RESTful

### `/src/lib`
Lógica de negocio:
- `db/` - Esquema y cliente de base de datos
- `services/` - Servicios por módulo
- `pdf/` - Generación de PDFs
- `excel/` - Import/export Excel
- `utils/` - Utilidades (cálculos, formatos, etc.)

### `/src/stores`
Estado global con Nanostores o similar

### `/src/types`
Definiciones de TypeScript para cada entidad

## 🚀 Próximos Pasos

1. Instalar dependencias:
```bash
npm install dexie xlsx pdf-lib jszip zod
npm install -D @types/node
```

2. Configurar TailwindCSS y shadcn/ui (si usas React)

3. Implementar el esquema de base de datos en `src/lib/db/schema.ts`

4. Comenzar con el flujo de autenticación y dashboard
