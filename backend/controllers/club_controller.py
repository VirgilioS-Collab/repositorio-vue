"""
Club Controller
Maneja las peticiones HTTP para los clubs/grupos
"""
from flask import request, jsonify
from services.club_service import ClubService
from services.jwt_service import JWTService as jwts

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

def update_club_settings(club_id):
    """
    PUT /api/admin/clubs/{club_id}/settings
    Actualiza los ajustes generales de un club
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
        
        # Verificar que el club existe
        existing_club = ClubService.get_club_details(club_id)
        if not existing_club:
            return jsonify({'error': 'Club no encontrado'}), 404
        
        # Obtener datos de configuración
        data = request.get_json()
        
        # Actualizar configuración del club
        success = ClubService.update_club_settings(club_id, data)
        
        if not success:
            return jsonify({'error': 'Error al actualizar la configuración del club'}), 500
        
        return jsonify({'message': 'Configuración del club actualizada correctamente'}), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500
