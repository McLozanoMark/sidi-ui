# SIDI Template v6.5

Plantilla demo HTML/CSS/JS sin base de datos. Abrir `index.html` o usar Laragon.

## Corrección v6.1
- La plantilla usa Font Awesome por CDN para evitar fallos de renderizado de sprites SVG al abrir archivos locales.
- Los iconos siguen centralizados mediante `.sidi-icon` y `SIDI.icon()`.
- Los tooltips de ayuda del título funcionan por hover/focus y por clic/tap.
- Los menús desplegables muestran flechas visibles mediante `sidi-chevron`.

## v6.2 - Sidebar acordeón y colapso desktop

- El botón sandwich en escritorio alterna el sidebar entre expandido y modo solo íconos.
- En móvil/tablet el mismo botón abre y cierra el drawer.
- El sidebar funciona como acordeón: solo una categoría principal abierta y solo una subcategoría hermana abierta.
- La ruta activa se abre automáticamente al cargar la página.
- La lógica vive en shared/sidi-common.js y los estilos en shared/sidi-layout.css.


## Actualización v6.3

- Categorías del sidebar con iconos únicos y coherentes por tema.
- Reportes Power BI con icono analítico en amarillo Power BI `#F2C811`.
- Subcategorías con icono folder morado.
- Flechas de despliegue con chevron hacia abajo.
- Cambio aplicado solo en `shared/`, sin tocar lógica específica de pantallas.
