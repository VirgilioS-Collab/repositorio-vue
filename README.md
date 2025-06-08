# Alianza UTP

![Logo provisional](./frontend/src/assets/logo.svg)

## 1. Descripción funcional

**Alianza UTP** es una aplicación web multicapa compuesta por:

- **Frontend**: Vue 3 + TypeScript + Vite  
- **Backend**: Flask (Python)

Permite a estudiantes y organizadores:

1. Registrar, editar y cancelar actividades académicas (título, descripción, fecha/hora, ubicación, enlace de inscripción).  
2. Gestionar grupos estudiantiles con inscripción y desinscripción de usuarios.  
3. Buscar y filtrar eventos mediante parámetros combinables y recibir notificaciones de cambios.

---

## 2. Funcionalidades principales planificadas

1. **CRUD de Actividades**  
   - Formularios con validación en tiempo real.  
   - Almacenamiento y modificación vía API REST.

2. **Gestión de Grupos**  
   - Catálogo de grupos por área de interés.  
   - Inscripción de usuarios con confirmación automática.

3. **Búsqueda y Notificaciones**  
   - Filtros por tipo, fecha y palabras clave.  
   - Recordatorios previos y alertas de cambios de horario o ubicación.

---

## 3. Requisitos de entorno

- **Node.js** ≥ 16  
- **pnpm**   
- **Python** ≥ 3.8  
- **git**

---

## 4. Instalación manual

### 4.1 Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/gestor_academico.git
cd gestor_academico
```

### 4.2 Configurar backend (Flask)
```bash
cd backend

# Crear y activar entorno virtual
python3 -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Linux/macOS:
source .venv/bin/activate

# Instalar dependencias
pip install --upgrade pip
pip install flask
pip freeze > requirements.txt

# Probar servidor de desarrollo
python app.py  
# → http://localhost:5000/api/hello
```

### 4.3 Configurar frontend (Vue 3 + TS)
```bash
cd frontend

# Instalar dependencias
pnpm install      # o npm install

# Ejecutar en modo desarrollo
pnpm run dev      # o npm run dev

# Abrir en el navegador:
http://localhost:5173
```


---

## 5. Validación inicial

La vista principal (`frontend/src/views/Home.vue`) incluye un componente `Navbar` y un mensaje placeholder que permite verificar que el proyecto arranca correctamente:

```vue
<template>
  <Navbar />
  <main class="main-content">
    <h1>Agenda Academia</h1>
    <p>Inicio cargado correctamente.</p>
  </main>
</template>
```

