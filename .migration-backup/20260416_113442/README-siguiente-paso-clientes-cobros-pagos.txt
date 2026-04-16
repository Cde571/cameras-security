Después de este script, revisa primero las pantallas listadas en:
clientes-cobros-pagos-async-report.txt

Qué buscar en cada una:
- llamadas sync como: const data = listarClientes()
- uso en render directo sin await
- useMemo con funciones ahora async
- variables inicializadas con arrays sync que ahora vienen de fetch

Cómo corregir:
- en React/TSX:
  usar useEffect + useState
- en Astro:
  usar await en frontmatter si corre en servidor
  o mover a componente cliente si depende de interacción

Prioridad:
1. páginas de clientes
2. páginas de cobros
3. páginas de pagos
4. dashboard si consume estos módulos