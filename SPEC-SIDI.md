# SPEC SIDI v6

Reconstrucción limpia desde cero, componentes reutilizables en `shared`, datos demo en `shared/sidi-data.js`, navegación por enlaces reales, confirmaciones como modales y toasts arriba a la derecha.


# Addendum v6.2 - Sidebar acordeón y colapso en escritorio

El botón sandwich del topbar tiene comportamiento por breakpoint. En escritorio alterna el sidebar entre expandido y colapsado a solo íconos. En tablet/móvil abre y cierra el drawer.

El sidebar debe comportarse como acordeón: solo una categoría principal puede estar abierta a la vez y solo una subcategoría hermana puede estar abierta dentro de la categoría activa.

Al cargar una página con ruta activa, se abre únicamente la categoría padre y la subcategoría padre correspondiente. Los demás grupos quedan cerrados.

La implementación debe vivir en shared/sidi-common.js y shared/sidi-layout.css. Queda prohibido implementar esta lógica en archivos JS o CSS específicos de pantalla.


## Actualización v6.3

- Categorías del sidebar con iconos únicos y coherentes por tema.
- Reportes Power BI con icono analítico en amarillo Power BI `#F2C811`.
- Subcategorías con icono folder morado.
- Flechas de despliegue con chevron hacia abajo.
- Cambio aplicado solo en `shared/`, sin tocar lógica específica de pantallas.
