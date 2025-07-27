"""
Club Controller
Maneja las peticiones HTTP para los clubs/grupos
"""
import json
from flask import request, jsonify, make_response
from services.club_service import ClubService
from services.jwt_service import JWTService as jwts
from emails.email_types import group_member_approved, group_member_rejected
from controllers.images_controller import ImageUploader
import pandas as pd

MAX_GROUPS_PER_USER = 4

@jwts.token_required('access')
def get_club_details(club_id):
    """
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
    try:
        user_id = request.current_user.get('user_id')
        groups = ClubService.get_user_related_groups(user_id=user_id)

        if not groups:
            return jsonify({'message': 'No se han encontrado grupos para el usuario.', 'Success': True}), 404
        
        return jsonify({'groups_list':groups}), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def create_club():
    """
    Crea un nuevo club/grupo.
    """
    try:
        user_id = request.current_user.get('user_id')
        data = request.get_json()

        group_name = data.get('group_name')
        group_category = data.get('group_category')
        group_desc = data.get('group_description')
        contact_info = data.get('contact_info', [])

        if not contact_info:
            contact_info = None
        else:
            contact_info = json.dumps(contact_info)

        message, success = ClubService.create_club_db(
            group_name=group_name,
            group_desc=group_desc,
            owner_id=user_id,
            group_category=group_category,
            max_group_per_user=MAX_GROUPS_PER_USER,
            contact_info=contact_info
        )

        if success:
            return jsonify({'message': message, 'success': success}), 201
        else:
            return jsonify({'message': message, 'success': success}), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error del servidor al procesar la solicitud'
        }), 500



@jwts.token_required('access')
def request_join_group(club_id: int):
    """
    Permite a un usuario solicitar unirse a un grupo.
    """
    try:
        user_id = request.current_user.get('user_id')
        message, success = ClubService.request_group_join_db(user_id, club_id)

        status_code = 200 if success else 400
        return jsonify({
            'success': success,
            'message': message
        }), status_code
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error del servidor al procesar la solicitud'
        }), 500


@jwts.token_required('access')
def upload_group_pfp(club_id):
    """
    Permite a un usuario subir una foto de perfil para el club.
    """
    try:
        image = request.files.get('image')
        if not image:
            return jsonify({"error": "No se recibió el archivo de imagen", "success": False}), 400

        payload = request.current_user
        user_id = payload['user_id']

        response = ImageUploader(image).run()

        print(response)

        if response.get("status") == 200:
            link = response["data"]["link"]

            message, success = ClubService.update_group_photo_in_db(club_id, user_id, link)

            if not success:
                return jsonify({
                        "message": message,
                        "success": False
                    }), 500
        
            return jsonify({
                "profile_photo_url": link,
                "success": True
            }), 200

        return jsonify({"error": "Error al subir la imagen.", "success": False}), 500
    except Exception as e:
        return jsonify({"message":"ha ocurrido un error en proceso de subida.", "success":False}), 500

#Administracion
@jwts.token_required('access')
def delete_club(club_id):
    """
    Elimina un club/grupo.
    """
    try:
        user_id = request.current_user.get('user_id')
        message, success = ClubService.delete_club_db(club_id, user_id)

        if not success:
            return jsonify({'message': message, 'success': success}), 400
        
        return jsonify({'message': message, 'success': success}), 200

    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def reactivate_club(club_id):
    """
    Reactiva un club/grupo eliminado.
    """
    try:
        user_id = request.current_user.get('user_id')
        message, success = ClubService.reactivate_club_db(club_id, user_id)

        if not success:
            return jsonify({'message': message, 'success': success}), 400

        return jsonify({'message': message, 'success': success}), 200

    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def update_club_settings(club_id):
    """
    Actualiza los ajustes generales de un club.
    """
    try:
        user_id = request.current_user.get('user_id')
        data = request.get_json()
        success = ClubService.update_club_settings(club_id, user_id, data)
        return jsonify({'message':success[0], 'success': success[1]}), 200
    
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500
    
@jwts.token_required('access')
def get_member_stats(club_id:int):
    """
    Obtiene estadísticas de miembros del club.
    """
    try:
        result = ClubService.get_administration_member_status(club_id=club_id)
        return jsonify({'member_stats':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500
    
    
@jwts.token_required('access')
def get_weekly_activity_heatmap(club_id:int):
    """
    Obtiene un mapa de calor semanal de actividades del club
    """
    try:
        result = ClubService.get_adm_weekly_activity_heatmap(club_id=club_id)
        return jsonify({'heatmap_data':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def get_activity_enrollment_stats(club_id:int):
    """
    Obtiene estadísticas de inscripción en actividades del club
    """
    try:
        result = ClubService.get_adm_activity_enrollment_stats(club_id=club_id)
        return jsonify({'enrollment_data':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500
    
@jwts.token_required('access')
def get_club_members(club_id:int):
    """
    Obtiene los miembros de un club
    """
    try:
        result = ClubService.get_club_members(club_id=club_id)
        return jsonify({'members_data':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def club_pending_approval_request(club_id: int):
    """
    Obtiene las solicitudes pendientes de un club
    """
    try:
        result = ClubService.get_club_pending_approvals(club_id=club_id)
        return jsonify({'requests_data':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500
    
@jwts.token_required('access')
def update_pending_join_request(club_id: int, request_id: int):
    """
    Actualiza el estado de una solicitud de unión pendiente a un club.
    """
    try:
        user_id = request.current_user.get('user_id')
        data = request.get_json()
        action = data.get('action')

        result = ClubService.update_pending_request(
            club_id=club_id,
            request_id=request_id,
            approval_user_id=user_id,
            action=action
        )
        status_code = 200 if result.get('success') else 400

        user_data = result.get('user_data') or {}

        if status_code == 200:
            if result.get('was_approved'):
                group_member_approved.send_group_member_approval_email(
                    recipient=user_data.get('email', ''),
                    fullname=user_data.get('fullname', ''),
                    group_name=user_data.get('group_name', '')
                )
            else:
                group_member_rejected.send_group_rejection_email(
                    recipient=user_data.get('email', ''),
                    fullname=user_data.get('fullname', ''),
                    group_name=user_data.get('group_name', '')
                )

        return jsonify({'message': result.get('message'), 'success': result.get('success')}), status_code

    except Exception as e:
        return jsonify({'message': str(e), 'success': False}), 500
    
@jwts.token_required('access')
def export_club_members(club_id):
    """
    Exporta los miembros del club en formato CSV
    Requiere autenticación
    """
    try:
        members_data = ClubService.get_club_members(club_id=club_id)

        # Validar que se obtuvo data
        if not members_data:
            return jsonify({"success": False, "message": "No hay datos de miembros para exportar."}), 404

        # Convertir a DataFrame y a CSV
        df = pd.DataFrame(members_data)
        csv_data = df.to_csv(index=False, encoding='utf-8-sig')

        # Preparar respuesta HTTP con archivo CSV
        response = make_response(csv_data)
        response.headers["Content-Disposition"] = "attachment; filename=members.csv"
        response.headers["Content-type"] = "text/csv"
        return response

    except Exception as e:
        print("Error exporting CSV:", e)
        return jsonify({"success": False, "message": "Error interno del servidor"}), 500