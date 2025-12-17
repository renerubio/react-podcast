# AGENTS.md

## Reglas identificadas en el proyecto

### 1. Estructura del proyecto

- El proyecto sigue una estructura modular basada en carpetas, donde cada funcionalidad principal tiene su propio directorio.
- Las páginas de Next.js están organizadas en la carpeta `src/app`.
- Los componentes reutilizables están ubicados en `src/components`.
- Los estilos están centralizados en `src/styles`.
- Los servicios para la lógica de negocio están en `src/services`.
- Las utilidades y constantes están en `src/utils`.

### 2. Convenciones de nombres

- Los nombres de los archivos y carpetas están en `camelCase`.
- Los componentes React tienen nombres en `PascalCase`.
- Los archivos de estilos CSS siguen el patrón `kebab-case`.

### 3. Uso de TypeScript

- El proyecto utiliza TypeScript para garantizar la seguridad de tipos.
- Las interfaces y tipos están definidos en `src/utils/interfaces.ts`.

### 4. Configuración de internacionalización

- La configuración de idiomas está centralizada en `src/i18nConfig.ts`.
- Los archivos de traducción están organizados en `src/locale`.

### 5. Gestión de navegación y contexto

- El contexto de feedback está definido en `src/context/FeedbackContext.tsx`.
- El contexto de carga está definido en `src/context/LoadingContext.tsx`.

### 6. Estilo de código

- El proyecto utiliza ESLint para mantener un estilo de código consistente.
- Las reglas de ESLint están configuradas en `eslint.config.mjs`.
- Se utiliza Prettier para el formateo del código.

### 7. Reglas para componentes

- Los componentes deben ser reutilizables y estar desacoplados.
- Los componentes deben recibir datos a través de props y evitar el uso excesivo de estados locales.

### 8. Reglas para servicios

- Los servicios manejan la lógica de negocio y las llamadas a APIs.
- Pueden incluir efectos controlados (por ejemplo, `fetch`), pero deben evitar efectos secundarios inesperados.

### 9. Reglas para estilos

- Los estilos globales están definidos en `src/styles/globals.css`.
- Los estilos específicos de componentes están en `src/styles/components.css`.
- Se deben usar clases CSS con nombres únicos para evitar conflictos.

### 10. Reglas para páginas

- Las páginas deben ser responsables de la estructura general y delegar la lógica a los componentes.
- Las páginas dinámicas están organizadas utilizando la estructura de carpetas de Next.js, como `[podcastId]` y `[episodeId]`.

### 11. Gestión de dependencias

- Las dependencias están definidas en `package.json`.
- Se deben usar versiones específicas para evitar problemas de compatibilidad.

### 12. Reglas para normalización de datos

- Los datos deben ser normalizados utilizando funciones en `src/utils/normalize.ts` antes de ser utilizados en los componentes.

### 13. Reglas para pruebas

- Las pruebas deben cubrir la lógica crítica del proyecto.
- Las pruebas unitarias deben ser rápidas y aisladas.

---

Este archivo debe mantenerse actualizado a medida que se identifiquen nuevas reglas o se modifiquen las existentes.
