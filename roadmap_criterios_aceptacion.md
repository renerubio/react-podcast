# Roadmap y Criterios de Aceptación — Podcasts SPA (Next.js 16, React 19, TS)

Autor: René · Última actualización: 04-nov-2025

---

## Convención de tags

- `screen-[vista]@m[n](-descriptor)` → hito por pantalla.
- `screen-global@final-vX.Y.Z` → release final estable.

---

## Roadmap por hitos (con criterios de aceptación)

### 1) `screen-home@m1` — Navegación y layout base _(Pre-release)_

**Criterios de aceptación**

- [x] SPA funcional sin recarga completa entre `/`, `/podcast/[id]`, `/podcast/[id]/episode/[episodeId]`.
- [x] URLs limpias (sin `#`).
- [x] Título de la app enlaza a `/`.
- [x] Indicador de navegación visible en top-right durante cambios de ruta.
- [x] Proyecto compila en dev y prod; ESLint/TS sin errores.

---

### 2) `screen-home@m1.1-images` — Grid + imágenes optimizadas _(Pre-release)_

**Criterios de aceptación**

- [x] Home renderiza hasta Top 100 (imagen, título, autor).
- [x] Imágenes servidas con `next/image` y dominio configurado en `next.config.ts`.
- [x] Navegación Home → Detalle de podcast sin recarga.
- [x] Diseño responsive y accesible (alt en imágenes).
- [x] Consola sin warnings ni errores de CORS.

---

### 3) `screen-home@m2-filter` — Filtro instantáneo _(Pre-release)_

**Criterios de aceptación**

- [x] Input de búsqueda accesible con label/placeholder.
- [x] Filtrado inmediato por **título** o **autor** (case/acento-insensitive).
- [x] Sin peticiones de red adicionales durante el filtrado.
- [x] Rendimiento fluido con 100 items.
- [x] Navegación a detalle sigue funcionando tras filtrar; sin warnings en consola.

---

### 4) `screen-home@m3-cache` — Caché 24 h + revalidación _(Pre-release)_

**Criterios de aceptación**

- [x] Al cargar `/`, si hay caché válida, se muestra **al instante**.
- [x] Revalidación silenciosa en segundo plano contra `/service/top-podcasts`.
- [x] TTL = 24 h; al expirar, se refresca automáticamente.
- [x] Fallback: sin red pero con caché válida, se mantiene la UI.
- [x] Errores solo en consola;

---

### 5) `screen-podcast@m1` — Detalle del podcast _(Pre-release)_

**Criterios de aceptación**

- [x] Barra lateral con imagen, título, autor, descripción.
- [x] Sección principal: número total de episodios y lista (título, fecha, duración).
- [x] Navegación a `/podcast/[id]/episode/[episodeId]` sin recarga.
- [x] Indicador de navegación durante la transición.
- [x] Normalización de datos (fechas, duración).

---

### 6) `screen-podcast@m2-cache` — Caché por `podcastId` _(Pre-release)_

**Criterios de aceptación**

- [x] Caché cliente por `podcastId` con TTL 24 h.
- [x] Revalidación silenciosa al reabrir el podcast.
- [x] Fallback sin red: muestra último estado cacheado.
- [x] Logs en consola ante errores; UI estable.
- [x] Skeletons y loaders

---

### 7) `screen-episode@m1` — Detalle del episodio _(Pre-release)_

**Criterios de aceptación**

- [x] Reutiliza la barra lateral del detalle del podcast (links activos al detalle).
- [x] Sección principal: título, descripción con **HTML interpretado** y **audio HTML5**.
- [x] Indicador de navegación coherente con el resto de vistas.

---

### 8) `screen-global@final-v1.0` — Release final _(Release)_

**Criterios de aceptación**

- [x] Todas las vistas completas y estables (Home + Detalle Podcast + Detalle Episodio).
- [x] Lint y TypeScript sin errores; tests básicos aprobados (si se incluyen).
- [x] README actualizado: stack, arquitectura por capas y decisiones.
- [x] Diseño responsive y fiel al enunciado.
- [x] Tags y Releases documentados; consola limpia de errores.

---

### 9) `screen-global@m1.1-architecture` — Refactorización de arquitectura _(Post-release)_

**Criterios de aceptación**

- [] Separación de lógica en capas: componentes, hooks reutilizables y servicios.
- [] Gestión de caché abstraída en servicios independientes.
- [] Componentes refactorizados para cumplir con el principio de responsabilidad única (SRP).
- [] Servicios distribuidos en módulos según su responsabilidad.
- [] Explicación de la arquitectura y decisiones en el README.

---

### 10) `screen-global@m1.2-styles` — Refactorización de estilos _(Post-release)_

**Criterios de aceptación**

- [] CSS modularizado por componentes.
- [] Uso de variables CSS para colores, tamaños y otros valores reutilizables.
- [] Gestión de estados visuales mejorada (hover, focus, active, etc.).
- [] Diseño responsive revisado y optimizado.
- [] Consola limpia de errores relacionados con estilos.

---

### 11) `screen-global@m1.3-performance` — Optimización de rendimiento _(Post-release)_

**Criterios de aceptación**

- [] Eliminación de renders innecesarios mediante control de dependencias en `useEffect`.
- [] Uso de memoización (`React.memo`, `useMemo`, `useCallback`) donde sea necesario.
- [] Análisis de rendimiento con React DevTools y ajustes realizados.
- [] Explicación de las optimizaciones en el README.

---

### 12) `screen-global@m1.4-tests` — Implementación de tests _(Post-release)_

**Criterios de aceptación**

- [] Tests unitarios para componentes clave.
- [] Tests de integración para flujos principales (Home, Detalle Podcast, Detalle Episodio).
- [] Ejemplo de test documentado en el README.
- [] Todos los tests pasan correctamente.
- [] Cobertura mínima del 80%.

---

### 13) `screen-global@m1.5-readme` — Documentación completa _(Post-release)_

**Criterios de aceptación**

- [] README actualizado con:
  - Tecnologías utilizadas.
  - Arquitectura del proyecto y patrones aplicados.
  - Decisiones de diseño y justificación.
  - Ejemplo de test.
  - Estrategia de caché y optimización.
- [] Explicación de la modularidad y división de componentes.
- [] Uso de herramientas de gestión de código (commits, ramas, etc.) documentado.
- [] Consola limpia de errores y warnings.

---

### 14) `screen-global@final-v1.1` — Release final mejorada _(Post-release)_

**Criterios de aceptación**

- [] Cumple con todos los criterios de los hitos anteriores.
- [] Diseño fiel al propuesto, completamente responsive.
- [] Uso de ContextAPI para la gestión de estado.
- [] Tipado completo con TypeScript en toda la aplicación.
- [] Componentes creados desde cero, sin librerías externas.
- [] Modo desarrollo y producción configurados correctamente:
  - Desarrollo: assets no minimizados.
  - Producción: assets concatenados y minimizados.
- [] Aplicación desplegada y accesible.
- [] Uso de SSR con Next.js.
- [] Variables CSS implementadas.
- [] Consola limpia de errores y warnings.

---

## Notas de validación

- Verificación de caché y revalidación: DevTools → Application (Local Storage) y Network.
- CORS gestionado vía API route (`/api/top-podcasts`) o AllOrigins.
- Política de errores: solo consola; UI mínima ante fallos.
