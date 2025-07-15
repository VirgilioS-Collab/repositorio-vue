"""
Club Controller
Maneja las peticiones HTTP para los clubs/grupos
"""
from flask import request, jsonify
from services.club_service import ClubService
from services.jwt_service import JWTService as jwts

@jwts.token_required('access')
def get_club_details(club_id):
    """
    GET /api/groups/{club_id}
    Obtiene los detalles de un club/grupo específico
    """
    try:
        club = ClubService.get_club_details(club_id)
        if not club:
            return jsonify({'error': 'Club no encontrado'}), 404
        
        return jsonify(club), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500


@jwts.token_required('access')
def get_club_by_user():
    """
    Obtener los grupos asociados al usuario.
    """
    user_id = request.current_user.get('user_id')
    groups = ClubService.get_user_related_groups(user_id=user_id)

    if not groups:
        return jsonify({'message': 'No se han encontrado grupos para el usuario.', 'Success': True}), 404
    
    return jsonify({'groups_list':groups}), 200

@jwts.token_required('access')
def create_club():
    pass

#Administracion

@jwts.token_required('access')
def update_club_settings(club_id):
    """
    PUT /api/admin/clubs/{club_id}/settings
    Actualiza los ajustes generales de un club
    Requiere autenticación
    """
    try:  
        data = request.get_json()
        success = ClubService.update_club_settings(club_id, data)
        return jsonify({'message':success[0], 'success': success[1]}), 200
    
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500
    
@jwts.token_required('access')
def get_member_stats(club_id:int):
    try:
        result = ClubService.get_administration_member_status(club_id=club_id)
        return jsonify({'member_stats':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500
    
    
@jwts.token_required('access')
def get_weekly_activity_heatmap(club_id:int):
    try:
        result = ClubService.get_adm_weekly_activity_heatmap(club_id=club_id)
        return jsonify({'heatmap_data':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def get_activity_enrollment_stats(club_id:int):
    try:
        result = ClubService.get_adm_activity_enrollment_stats(club_id=club_id)
        return jsonify({'enrollment_data':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500
    
@jwts.token_required('access')
def get_club_members(club_id:int):
    try:
        result = ClubService.get_club_members(club_id=club_id)
        return jsonify({'members_data':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500