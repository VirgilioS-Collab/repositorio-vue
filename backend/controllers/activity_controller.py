"""
Activity Controller
Maneja las peticiones HTTP para las actividades
"""
from flask import request, jsonify
from services.activity_service import ActivityService
from services.jwt_service import JWTService as jwts
from emails.email_types.joined_activity import send_activity_join_email
from emails.email_types.left_activity import send_activity_left_email


@jwts.token_required('access')
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

@jwts.token_required('access')
def get_activity_by_id(activity_id):
    """
    GET /api/activities/{activity_id}
    Obtiene una actividad específica por ID
    """
    try:
        activity = ActivityService.get_activity_by_id(activity_id)
        if not activity:
            return jsonify({'message': 'Actividad no encontrada', 'Success': True}), 404
        
        return jsonify(activity), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def get_activities_by_group(group_id):
    """
    GET /api/groups/{group_id}/activities
    Obtiene todas las actividades de un grupo específico
    """
    try:
        activities = ActivityService.get_activities_by_group(group_id)
        if not activities:
            return jsonify({'message': 'No se encontraron actividades para el grupo.', 'Success': True}), 404
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def get_activities_by_club_admin(club_id):
    """
    GET /api/admin/clubs/{club_id}/activities
    Obtiene todas las actividades de un club para administración
    Requiere autenticación
    """
    try:      
        activities = ActivityService.get_activities_by_club_admin(club_id)
        if not activities:
            return jsonify({'message': 'No se encontraron actividades para el grupo.', 'Success': True}), 404
        
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500


@jwts.token_required('access')
def create_activity(club_id):
    """
    POST /api/admin/clubs/{club_id}/activities
    Crea una nueva actividad para un club
    Requiere autenticación
    """
    try:
        # Obtener datos de la actividad
        data = request.get_json()
        payload = request.current_user
        # Crear la actividad
        activity = ActivityService.create_activity(club_id, data, payload.get('user_id'))
        
        if not activity:
            return jsonify({'error': 'Error al crear la actividad'}), 500
        
        return jsonify({'message': activity[0], 'success': activity[1]}), 201
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def update_activity_details(activity_id):
    """
    PUT /api/admin/activities/{activity_id}
    Actualiza una actividad existente
    Requiere autenticación
    """
    try:
        user_id = request.current_user.get('user_id')
        data = request.get_json()

        success, message = ActivityService.update_activity(activity_id, user_id, data)

        status_code = 200 if success else 409
        return jsonify({'success': success, 'message': message}), status_code

    except Exception as e:
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500


@jwts.token_required('access')
def delete_activity(activity_id):
    """
    DELETE /api/admin/activities/{activity_id}
    Elimina una actividad
    Requiere autenticación
    """
    try:
        user_id = request.current_user.get('user_id')
        # Eliminar la actividad
        success = ActivityService.delete_activity(activity_id, user_id)
        
        if not success[0]:
            return jsonify({'message': success[1], 'success':success[0]}), 500
        
        return jsonify({'message': success[1], 'success':success[0]}), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def join_activity(activity_id):
    try:
        user_id = request.current_user.get('user_id')

        success, message, data = ActivityService.join_activity(activity_id, user_id)

        status_code = 200 if success else 409

        if success:
            email = data.get('email')
            
            send_activity_join_email(recipient=email, data=data)

        return jsonify({'message': message, 'success':success}), status_code

    except Exception as e:
        print(str(e))
        return jsonify({f'error': 'Error interno del servidor'}), 500


@jwts.token_required('access')
def leave_activity(activity_id):
    try:
        user_id = request.current_user.get('user_id')

        success, message, data = ActivityService.leave_activity(activity_id, user_id)

        status_code = 200 if success else 409

        if success:
            email = data.get('email')
            send_activity_left_email(recipient=email, data=data)

        return jsonify({'message': message, 'success':success}), status_code

    except Exception as e:
        print(str(e))
        return jsonify({f'error': 'Error interno del servidor'}), 500
