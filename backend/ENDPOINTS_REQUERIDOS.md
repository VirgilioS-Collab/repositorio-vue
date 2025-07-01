# Endpoints Requeridos para el Frontend

Este documento lista todos los endpoints que necesitas implementar en el backend para que funcionen los nuevos métodos DAO del frontend.

## 1. ACTIVITY ENDPOINTS (ActivityDao.ts)

### Rutas para estudiantes (públicas):
- **GET** `/activities` - Obtener todas las actividades
- **GET** `/activities/{activityId}` - Obtener actividad por ID
- **GET** `/groups/{groupId}/activities` - Obtener actividades de un grupo

### Rutas para administradores:
- **GET** `/admin/clubs/{clubId}/activities` - Obtener actividades del club (admin)
- **POST** `/admin/clubs/{clubId}/activities` - Crear nueva actividad
- **PUT** `/admin/activities/{activityId}` - Actualizar actividad
- **DELETE** `/admin/activities/{activityId}` - Eliminar actividad

### Estructura de datos Activity (nombres exactos):
```python
{
    "activity_id": int,
    "activity_name": str,
    "activity_description": str (opcional),
    "max_participants": int (opcional),
    "activity_type_id": int,
    "activity_status_id": int,
    "group_id": int,
    "creator_id": int,
    "activity_datetime": str,  # Formato ISO
    "location": str (opcional),
    "participants_count": int (opcional),
    "activity_type_name": str (opcional),
    "activity_status_name": str (opcional),
    "group_name": str (opcional)
}
```

## 2. CLUB ENDPOINTS (ClubDao.ts)

### Rutas:
- **GET** `/groups/{clubId}` - Obtener detalles del club/grupo
- **PUT** `/admin/clubs/{clubId}/settings` - Actualizar configuración del club

### Estructura de datos ClubSettings (nombres exactos):
```python
{
    "logo_url": str (opcional),
    "description": str (opcional),
    "social_links": {
        "facebook": str (opcional),
        "instagram": str (opcional),
        "twitter": str (opcional),
        "website": str (opcional)
    },
    "has_funds": bool (opcional)
}
```

## 3. FINANCE ENDPOINTS (FinanceDao.ts)

### Rutas:
- **GET** `/admin/clubs/{clubId}/finances/summary` - Obtener resumen financiero
- **GET** `/admin/clubs/{clubId}/finances/transactions` - Obtener todas las transacciones
- **POST** `/admin/clubs/{clubId}/finances/transactions` - Crear nueva transacción

### Estructura FinanceSummary (nombres exactos):
```python
{
    "income": float,
    "expenses": float,
    "balance": float
}
```

### Estructura Transaction (nombres exactos):
```python
{
    "id": int,
    "date": str,  # Formato ISO "YYYY-MM-DDTHH:MM:SSZ"
    "description": str,
    "category": str,
    "type": str,  # "income" o "expense"
    "amount": float
}
```

## 4. PASOS RECOMENDADOS:

1. **Crear nuevos archivos de rutas:**
   - `backend/routes/activity_routes.py`
   - `backend/routes/club_routes.py` 
   - `backend/routes/finance_routes.py`

2. **Crear controladores correspondientes:**
   - `backend/controllers/activity_controller.py`
   - `backend/controllers/club_controller.py`
   - `backend/controllers/finance_controller.py`

3. **Crear servicios correspondientes:**
   - `backend/services/activity_service.py`
   - `backend/services/club_service.py`
   - `backend/services/finance_service.py`

4. **Registrar las nuevas rutas en `app.py`**

5. **Usar los nombres de variables EXACTOS** como están definidos en los DTOs del frontend para mantener consistencia.

## IMPORTANTE:
- Mantén los nombres de campos exactamente como están en los DTOs del frontend
- Usa el mismo formato de fechas (ISO)
- Respeta los tipos de datos (int, str, float, bool)
- Los campos marcados como "opcional" pueden ser None/null
