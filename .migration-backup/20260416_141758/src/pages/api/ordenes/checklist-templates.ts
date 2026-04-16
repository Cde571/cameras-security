import type { APIRoute } from "astro";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const templates = [
  {
    id: "instalacion-basica",
    nombre: "Instalación básica",
    items: [
      { id: "cableado", label: "Cableado instalado", checked: false },
      { id: "energia", label: "Punto de energía validado", checked: false },
      { id: "camaras", label: "Cámaras instaladas", checked: false },
      { id: "grabador", label: "Grabador configurado", checked: false },
      { id: "pruebas", label: "Pruebas funcionales realizadas", checked: false }
    ]
  },
  {
    id: "mantenimiento",
    nombre: "Mantenimiento",
    items: [
      { id: "limpieza", label: "Limpieza de equipos", checked: false },
      { id: "conexion", label: "Verificación de conexiones", checked: false },
      { id: "almacenamiento", label: "Revisión de almacenamiento", checked: false },
      { id: "firmware", label: "Validación de firmware", checked: false },
      { id: "cierre", label: "Cierre técnico realizado", checked: false }
    ]
  }
];

export const GET: APIRoute = async () => {
  return json({ ok: true, items: templates });
};