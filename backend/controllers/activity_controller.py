"""
Activity Controller
Maneja las peticiones HTTP para las actividades
"""
from flask import request, jsonify
from services.activity_service import ActivityService
from services.jwt_service import JWTService as jwts

def get_all_activities():
    """
    GET /api/activities
    Obtiene todas las actividades disponibles para estudiantes
    """
    try:
        activities = ActivityService.get_all_activities()
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

def get_activity_by_id(activity_id):
    """
    GET /api/activities/{activity_id}
    Obtiene una actividad específica por ID
    """
    try:
        activity = ActivityService.get_activity_by_id(activity_id)
        if not activity:
            return jsonify({'error': 'Actividad no encontrada'}), 404
        
        return jsonify(activity), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

def get_activities_by_group(group_id):
    """
    GET /api/groups/{group_id}/activities
    Obtiene todas las actividades de un grupo específico
    """
    try:
        activities = ActivityService.get_activities_by_group(group_id)
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

def get_activities_by_club_admin(club_id):
    """
    GET /api/admin/clubs/{club_id}/activities
    Obtiene todas las actividades de un club para administración
    Requiere autenticación
    """
    try:
        # Verificar token de autenticación
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token de acceso requerido'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwts.decode_token(token)
        
        if not payload:
            return jsonify({'error': 'Token inválido'}), 401
        
        # Aquí podrías verificar permisos de administración del club
        # user_id = payload.get('user_id')
        
        activities = ActivityService.get_activities_by_club_admin(club_id)
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

def create_activity(club_id):
    """
    POST /api/admin/clubs/{club_id}/activities
    Crea una nueva actividad para un club
    Requiere autenticación
    """
    try:
        # Verificar token de autenticación
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token de acceso requerido'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwts.decode_token(token)
        
        if not payload:
            return jsonify({'error': 'Token inválido'}), 401
        
        user_id = payload.get('user_id')
        
        # Obtener datos de la actividad
        data = request.get_json()
        
        # Validaciones básicas
        required_fields = ['activity_name', 'activity_type_id', 'group_id', 'activity_datetime']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Crear la actividad
        activity = ActivityService.create_activity(club_id, data, user_id)
        
        if not activity:
            return jsonify({'error': 'Error al crear la actividad'}), 500
        
        return jsonify(activity), 201
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

def update_activity(activity_id):
    """
    PUT /api/admin/activities/{activity_id}
    Actualiza una actividad existente
    Requiere autenticación
    """
    try:
        # Verificar token de autenticación
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token de acceso requerido'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwts.decode_token(token)
        
        if not payload:
            return jsonify({'error': 'Token inválido'}), 401
        
        # Verificar que la actividad existe
        existing_activity = ActivityService.get_activity_by_id(activity_id)
        if not existing_activity:
            return jsonify({'error': 'Actividad no encontrada'}), 404
        
        # Obtener datos de actualización
        data = request.get_json()
        
        # Actualizar la actividad
        updated_activity = ActivityService.update_activity(activity_id, data)
        
        if not updated_activity:
            return jsonify({'error': 'Error al actualizar la actividad'}), 500
        
        return jsonify(updated_activity), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

def delete_activity(activity_id):
    """
    DELETE /api/admin/activities/{activity_id}
    Elimina una actividad
    Requiere autenticación
    """
    try:
        # Verificar token de autenticación
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token de acceso requerido'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwts.decode_token(token)
        
        if not payload:
            return jsonify({'error': 'Token inválido'}), 401
        
        # Verificar que la actividad existe
        existing_activity = ActivityService.get_activity_by_id(activity_id)
        if not existing_activity:
            return jsonify({'error': 'Actividad no encontrada'}), 404
        
        # Eliminar la actividad
        success = ActivityService.delete_activity(activity_id)
        
        if not success:
            return jsonify({'error': 'Error al eliminar la actividad'}), 500
        
        return jsonify({'message': 'Actividad eliminada correctamente'}), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500
