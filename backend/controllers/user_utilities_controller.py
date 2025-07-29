from flask import request, jsonify
import requests
from services import user_utilities_service as uus
from services.jwt_service import JWTService as jwts
from controllers.images_controller import ImageUploader
from emails.email_types.joined_activity import send_activity_join_email
from emails.email_types.left_activity import send_activity_left_email


@jwts.token_required("refresh")
def change_password():
    """
    Cambia la contraseña del usuario autenticado usando el token JWT.
    """
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    payload = request.current_user
    user_id = payload['user_id']

    
    #Verifica la autenticidad del token
    result = uus.verify_auth_refresh({'user_id': payload['user_id'], 'jti': payload['jti']})

    if not result[1]:
        return jsonify({"message": "Token invalido", "success": False}), 404
    # Obtener contraseña actual desde la BD
    hashed_password, _ = uus.get_user_encrypted_password(user_id=user_id)

    if not uus.validate_password(current_password, hashed_password):
        return jsonify({"message": "La contraseña no coincide", "success": False}), 401

    # Actualizar contraseña
    new_hashed = uus.hash_password(new_password)
    message, success = uus.update_user_password(user_id=user_id, hashed_password=new_hashed)

    if not success:
        return jsonify({"message": message, "success": success}), 500

    # Invalidar tokens antiguos
    cleanup_msg, _ = uus.deactivate_user_tokens(user_id=user_id)

    return jsonify({
        "success": True,
        "message": "Contraseña actualizada correctamente.",
        "token_cleanup": cleanup_msg
    }), 200

@jwts.token_required('access')
def get_activities_by_user():
    """
    Devuelve todas las actividades por usuario para el proceso de login
    """
    payload = request.current_user
    user_id = payload.get('user_id')
    try:
        activities = uus.get_user_related_activities(user_id=user_id)
    except Exception as e:
        return jsonify({"error": "Error al consultar actividades"}), 500
    
    return jsonify({'activities_list':activities}), 200
    

@jwts.token_required('access')
def update_user_information():
    """ Actualiza la información personal del usuario autenticado.
     Utiliza el token JWT para identificar al usuario y actualiza los datos proporcionados en la solicitud."""
    try:
        user_id = request.current_user.get('user_id')
        user_data = request.get_json()

        message, success = uus.update_user_personal_info(user_id, user_data)

        status_code = 200 if success else 400
        
        return jsonify({
            'success': success,
            'message': message
        }), status_code

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error interno del servidor.'
        }), 500



@jwts.token_required('access')
def join_activity(activity_id):
    """ Permite a un usuario unirse a una actividad específica.
     Utiliza el token JWT para identificar al usuario y realiza la operación de unión a la actividad."""
    try:
        user_id = request.current_user.get('user_id')

        success, message, data = uus.join_activity(activity_id, user_id)

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
    """ Permite a un usuario abandonar una actividad específica.
     Utiliza el token JWT para identificar al usuario y realiza la operación de abandono de la actividad."""
    try:
        user_id = request.current_user.get('user_id')

        success, message, data = uus.leave_activity(activity_id, user_id)

        status_code = 200 if success else 409

        if success:
            email = data.get('email')
            send_activity_left_email(recipient=email, data=data)

        return jsonify({'message': message, 'success':success}), status_code

    except Exception as e:
        print(str(e))
        return jsonify({f'error': 'Error interno del servidor'}), 500

@jwts.token_required('access')
def get_user_notifications():
    """ Obtiene las notificaciones del usuario autenticado.
     Utiliza el token JWT para identificar al usuario y devuelve las notificaciones almacenadas en la base de datos.
    """
    try:
        user_id = request.current_user.get('user_id')
        result = uus.get_user_notifications_db(user_id=user_id)
        return jsonify({'notifications':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500
    
@jwts.token_required('access')
def update_user_notifications():
    """ Actualiza las notificaciones del usuario autenticado.
     Utiliza el token JWT para identificar al usuario y actualiza las notificaciones según los IDs proporcionados en la solicitud.
     """
    try:
        user_id = request.current_user.get('user_id')
        data = request.get_json()

        notification_ids = data.get("notification_ids")

        if not isinstance(notification_ids, list):
            return jsonify({
                'error': 'El campo notification_ids debe ser una lista.',
                'success': False
            }), 400

        # Si la lista esta vacia, no se hace nada
        if not notification_ids:
            return jsonify({
                'message': 'No se proporcionaron notificaciones para actualizar.',
                'success': True
            }), 200

        result = uus.update_user_notifications_bd(user_id=user_id, notification_ids=notification_ids)

        return jsonify({
            'message': 'Se han actualizado las notificaciones correctamente.',
            'success': result
        }), 200

    except Exception as e:
        return jsonify({'error': 'Error interno del servidor', 'success': False}), 500

@jwts.token_required('access')
def upload_user_pfp():
    """ Permite al usuario autenticado subir una imagen de perfil.
     Utiliza el token JWT para identificar al usuario y procesa la imagen recibida en la solicitud."""
    try:
        image = request.files.get('profileImage')
        if not image:
            return jsonify({"error": "No se recibió el archivo de imagen", "success": False}), 400

        payload = request.current_user
        user_id = payload['user_id']

        response = ImageUploader(image).run()

        if response.get("status") == 200:
            link = response["data"]["link"]

            message, success = uus.update_user_photo_in_db(user_id, link)

            if not success:
                return jsonify({
                        "profile_photo_url": link,
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

@jwts.token_required('access')  
def upcoming_user_events():
    """Obtiene los eventos próximos del usuario autenticado.
     Utiliza el token JWT para identificar al usuario y devuelve los eventos almacenados en la base de datos."""
    try:
        if request.method == 'OPTIONS':
            return jsonify({'message': 'OK'}), 200
        user_id = request.current_user.get('user_id')
        result = uus.get_upcoming_events(user_id=user_id)
        return jsonify({'upcoming_events':result}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Error interno del servidor'}), 500
