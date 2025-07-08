# Requerimientos Funcionales [cite: 1]

## [cite_start]RF1 – Perfil Estudiantil [cite: 2]

[cite_start]**Objetivo (RF1):** Permitir al estudiante gestionar su información personal y consultar su historial de participación. [cite: 3]

* [cite_start]**RF1.1** Formulario de edición de datos personales (nombre, correo, teléfono, descripción, foto de perfil). [cite: 4]
* [cite_start]**RF1.2** Listado de clubs inscritos, mostrando nombre, categoría y estado de inscripción. [cite: 5]
* [cite_start]**RF1.3** Historial de actividades inscritas, detallando nombre, fecha, estado de asistencia y rol (participante/organizador). [cite: 6]
* [cite_start]**RF1.4** Búsqueda y filtros sobre historial: [cite: 7]
  * [cite_start]**RF1.4.1** Filtrar por rango de fechas (desde–hasta). [cite: 8]
  * [cite_start]**RF1.4.2** Filtrar por categoría o club organizador. [cite: 9]
  * [cite_start]**RF1.4.3** Búsqueda por palabra clave en nombre, club o tema. [cite: 10]
* [cite_start]**RF1.5** Configuración de notificaciones de privacidad: activar/desactivar alertas por e-mail sobre cambios de actividad o nuevos eventos. [cite: 11]

---

## [cite_start]RF2 – Inicio de Sesión y Registro [cite: 12]

[cite_start]**Objetivo (RF2):** Controlar el acceso seguro de usuarios y facilitar el registro de nuevos perfiles. [cite: 13]

* [cite_start]**RF2.1** Autenticación de usuarios mediante correo/usuario + contraseña. [cite: 14]
* [cite_start]**RF2.2** Recuperación de contraseña vía e-mail. [cite: 15]
* [cite_start]**RF2.3** Registro de nuevos perfiles con datos básicos y opción de completar perfil (foto, descripción). [cite: 16]
* [cite_start]**RF2.4** Validaciones en tiempo real de formato de correo, fuerza de contraseña y unicidad de usuario. [cite: 17]

---

## [cite_start]RF3 – Página de Actividades [cite: 18]

[cite_start]**Objetivo (RF3):** Proveer una interfaz para listar, filtrar y gestionar la inscripción en actividades disponibles. [cite: 19]

* [cite_start]**RF3.1** Listado general de actividades en tarjetas con: nombre, fecha, hora, descripción breve, club organizador, lugar (físico/online) e indicador de plazas disponibles. [cite: 20]
* [cite_start]**RF3.2** Búsqueda y filtros avanzados en listado: [cite: 21]
  * [cite_start]**RF3.2.1** Filtrar por categoría o tipo de actividad. [cite: 22]
  * [cite_start]**RF3.2.2** Filtrar por fecha (hoy, semana, próximas). [cite: 23]
  * [cite_start]**RF3.2.3** Filtrar por club organizador. [cite: 24]
  * [cite_start]**RF3.2.4** Ordenar por más recientes o próximas. [cite: 25]
* [cite_start]**RF3.3** Paginación o carga progresiva con botón “Ver más” y loader visual. [cite: 26]
* [cite_start]**RF3.4** Vista de detalle de actividad con: [cite: 27]
  * [cite_start]Nombre y descripción completa. [cite: 28]
  * [cite_start]Fecha/hora de inicio y fin, duración estimada. [cite: 29]
  * [cite_start]Cupo máximo y plazas disponibles. [cite: 30]
  * [cite_start]Botón de inscripción (habilitado sólo si quedan plazas y el usuario cumple requisitos). [cite: 31]
  * [cite_start]Confirmación visual de inscripción o cancelación. [cite: 32]

---

## [cite_start]RF4 – Página de Clubs [cite: 33]

[cite_start]**Objetivo (RF4):** Permitir la exploración, filtrado y solicitud de inscripción en los clubs disponibles. [cite: 34]

* [cite_start]**RF4.1** Listado de clubs en tarjetas o tabla con: nombre, descripción breve, categoría (académico, deportivo, cultural), miembros actuales vs. cupo máximo, estado (activo/inactivo/inscripción cerrada). [cite: 35]
* [cite_start]**RF4.2** Búsqueda y filtros en listado de clubes: [cite: 36]
  * [cite_start]**RF4.2.1** Búsqueda por palabra clave. [cite: 37]
  * [cite_start]**RF4.2.2** Filtrar por categoría. [cite: 38]
  * [cite_start]**RF4.2.3** Filtrar por estado del club. [cite: 39]
* [cite_start]**RF4.3** Solicitud de inscripción a club: [cite: 40]
  * [cite_start]Botón “Unirse” o “Solicitar inscripción”. [cite: 41]
  * [cite_start]Control de cupo: deshabilitar si está lleno; permitir lista de espera. [cite: 42]
  * [cite_start]Confirmación de estado (miembro, no miembro, pendiente). [cite: 43]
* [cite_start]**RF4.4** Perfil de club con: [cite: 44]
  * [cite_start]Información general (nombre, descripción, imagen/banner, fecha de creación). [cite: 45]
  * [cite_start]Cupo y número actual de miembros. [cite: 46]
  * [cite_start]Lista de actividades asociadas (con enlaces a detalle y estado de inscripción del usuario). [cite: 47]

---

## [cite_start]RF5 – Panel de Administrador [cite: 48]

[cite_start]**Objetivo (RF5):** Brindar a roles administrativos herramientas centralizadas para gestionar clubes, miembros, eventos y finanzas. [cite: 49]

### [cite_start]RF5.1 – Dashboard [cite: 50]

[cite_start]**Objetivo (RF5.1):** Mostrar indicadores clave y próximos eventos con capacidades de filtrado. [cite: 51]

* [cite_start]**RF5.1.1** KPI Cards: miembros activos, eventos próximos, recaudo mes, saldo disponible. [cite: 52]
* [cite_start]**RF5.1.2** Gráficas: [cite: 53]
  * [cite_start]Línea dual altas vs. bajas de miembros. [cite: 54]
  * [cite_start]Línea de inscripciones vs. tiempo. [cite: 55]
  * [cite_start]Heat-map semanal (semana × 24 h). [cite: 56]
* [cite_start]**RF5.1.3** Tabla “Próximos Eventos” editable con columnas: nombre, fecha, club organizador, cupo, plazas disponibles, estado; filtros rápidos (tipo, estado, fecha) y enlace “Ver todo” a pestaña Eventos. [cite: 57, 58]
* [cite_start]**RF5.1.4** Gráfico de barras apiladas Ingresos vs. Egresos (visible sólo si club.hasFunds). [cite: 59]

### [cite_start]RF5.2 – Gestión de Miembros [cite: 60]

[cite_start]**Objetivo (RF5.2):** Facilitar la administración masiva y detallada de miembros. [cite: 61]

* [cite_start]**RF5.2.1** Tabla paginada de miembros con columnas: nombre, correo, rol, estado (activo/inactivo); búsqueda y filtros (todo / activos / inactivos / rol). [cite: 62, 63]
* [cite_start]**RF5.2.2** Botón “Invitar” (modal para múltiples e-mails) y acciones masivas: activar, desactivar, cambiar rol, enviar e-mail. [cite: 64]
* [cite_start]**RF5.2.3** Exportación de CSV con barra de progreso. [cite: 65]

### [cite_start]RF5.3 – Gestión de Eventos [cite: 66]

[cite_start]**Objetivo (RF5.3):** Permitir CRUD completo y análisis de eventos. [cite: 67]

* [cite_start]**RF5.3.1** Calendario mensual (vue3-cal) + tabla CRUD de eventos (tipos: torneo, entrenamiento, venta de comida, reunión). [cite: 68]
* [cite_start]**RF5.3.2** Filtros combinados: tipo, estado, rango de fechas (desde-hasta), palabra clave. [cite: 69]
* [cite_start]**RF5.3.3** Columnas en tabla de eventos: cupo máximo, plazas disponibles, estado de inscripción. [cite: 70]
* [cite_start]**RF5.3.4** Sección Finanzas (sólo para roles tesorero/líder y si club.hasFunds): [cite: 71]
  * [cite_start]**RF5.3.4.1** Resumen mensual de ingresos, egresos y saldo. [cite: 72]
  * [cite_start]**RF5.3.4.2** Gráfica de línea de saldo histórico. [cite: 73]
  * [cite_start]**RF5.3.4.3** Tabla de transacciones con filtros (tipo, categoría), búsqueda, exportar CSV y botón “Agregar transacción”. [cite: 74]

### [cite_start]RF5.4 – Ajustes [cite: 75]

[cite_start]**Objetivo (RF5.4):** Configurar datos, permisos y acciones críticas del club. [cite: 76]

* [cite_start]**RF5.4.1** Configuración de datos del club: logo (upload + preview), descripción, enlaces (FB, IG, Twitter, Web). [cite: 77]
* [cite_start]**RF5.4.2** Switch “Maneja fondos” para activar/desactivar módulo financiero. [cite: 78]
* [cite_start]**RF5.4.3** Sub-sección “Permisos”: matriz de chequeo por módulo para asignar roles y accesos. [cite: 79]
* [cite_start]**RF5.4.4** “Zona peligrosa”: acciones críticas (transferir liderazgo, archivar club, eliminar club) con confirmaciones adicionales. [cite: 80]

---

# [cite_start]Requerimientos No Funcionales [cite: 81

## [cite_start]RNF1 – Rendimiento [cite: 82]

* [cite_start]**RNF1.1** Soportar al menos 1 000 usuarios concurrentes. [cite: 83]
* **RNF1.2** Tiempo de respuesta < 2 s en vistas principales; [cite_start]< 3 s en operaciones críticas. [cite: 84]

## [cite_start]RNF2 – Seguridad [cite: 85]

* [cite_start]**RNF2.1** Autenticación basada en JWT u OAuth 2.0. [cite: 86]
* [cite_start]**RNF2.2** Prevención de XSS y CSRF; validación estricta de todos los inputs. [cite: 87]

## [cite_start]RNF3 – Usabilidad & Accesibilidad [cite: 88]

* [cite_start]**RNF3.1** Cumplimiento WCAG 2.1 (contraste, navegación por teclado, labels legibles). [cite: 89]

## [cite_start]RNF4 – Mantenibilidad [cite: 90]

* [cite_start]**RNF4.1** Arquitectura modular basada en Vue 3 + Pinia stores reutilizables. [cite: 91]

---

# Ilustraciones

### [cite_start]Ilustración 1: Vista del login de la plataforma [cite: 92, 93]

![Vista del login de la plataforma](https://storage.googleapis.com/maker-response-images/v1/71e6aa90-c24c-4e8c-8f2e-4375da665243)

### [cite_start]Ilustración 2: Vista principal de la agenda académica [cite: 94, 95]

*(Nota: La imagen proporcionada corresponde a la vista de login de la Ilustración 1).*

```

```
