from flask import request, jsonify
from services import auth_service
from services.jwt_service import JWTService as jwts

def login_user() -> tuple:
    """
    inicio de sesión de usuario
    """
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not password or not (username or email):
        return jsonify({"success": False, "message": "Credenciales incompletas"}), 400

    user_data = auth_service.login_user_db(username=username, email=email)

    if not user_data:
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404
    
    if auth_service.validate_password(input_password=password, hashed_password=user_data[8]):
    
        user_payload =  {
            'user_id': user_data[0],
            'username': user_data[1],
            'email': user_data[2]
        }

        token = jwts.create_token(user_data=user_payload)
        if user_data[9] is None:
            refresh_token = jwts.create_refresh_token(user_data=user_payload)

            token_result = auth_service.create_user_refresh_token_db(user_data={'user_id': user_data[0], 
                                                                            'refresh_token': refresh_token})
            if token_result[1] is False:
                return jsonify({'message': token_result[0], 'success': False})
        else:
            refresh_token = user_data[9]

        response = {
            'name': user_data[3],
            'last_name': user_data[4],
            'profile_photo_url': user_data[5],
            'user_type': user_data[6],
            'user_status': user_data[7],
            'success': True,
            'token': token,
            'refresh_token': refresh_token,
            'message': 'Login exitoso'}
        
        return jsonify(response), 200
    else:
        return jsonify({"success": False, "message": "Contraseña incorrecta"}), 401

def create_user() -> tuple:
    """
    Creacion de usuario
    """
    data = request.get_json()

    user_data = auth_service.create_user_db(data)

    if isinstance(user_data, (list, tuple)) and len(user_data) > 0:
        return jsonify({  
            "message": user_data[0],    
            "success": True
        }), 201
    else:
        return jsonify({
            "success": False,
            "message": user_data[0] if isinstance(user_data, (list, tuple)) and len(user_data) > 0 else "Error desconocido al crear usuario"
        }), 400

def user_refresh_token():
    """
    Función para crear un nuevo access token en base a un refresh token
    """
    data = request.get_json()

    refresh_token = data.get("refresh_token")

    if not refresh_token:
        return jsonify({'error': 'No se encuentra el refresh token'}), 401
    
    payload = jwts.verifiy_token(refresh_token)

    if not payload or payload.get("type") != "refresh":
        return jsonify({"error": "Invalid refresh token"}), 401

    new_access_token = jwts.create_token({
        "user_id": payload["user_id"],
        "username": payload["username"],
        "email": payload["email"]
    })

    return jsonify({
        "token": new_access_token
    }), 200

def user_forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message':'el email es requerido.', 'success': False})
    
    if not auth_service.verify_email_db(email=email):
        return jsonify({'message': 'el correo no existe.', 'success': False})
    
    code = auth_service.gen_random_fp_code()

    inserted = auth_service.email_code_insert_db(email, code, expires_in=10)

    if not inserted:
        return jsonify({'message': 'No se pudo generar el código, intente más tarde.', 'success': False}), 500
    
    if not auth_service.send_email_code(email, "¿Olvidaste tu contraseña? Aquí está tu código de acceso", code):
        return jsonify({'message': 'No se pudo enviar el código, intente más tarde.', 'success': False}), 500
    
    reset_token = jwts.create_token(user_data={'email': email})

    return jsonify({'message': 'codigo enviado exitosamente.', 'token': reset_token,'success': True}), 200

@jwts.token_required
def verify_pass_reset_code():
    """
    Verifica que el codigo introducido sea correcto a nivel de base de datos
    """
    data = request.get_json()

    code = data.get('verificationCode')

    if not code:
        return jsonify({"message": 'el codigo es requerido.', 'success':False})
    
    email = request.current_user.get('email')

    if not email:
         return jsonify({'message': 'Token inválido: sin correo.', 'success': False}), 401
    
    is_valid = auth_service.verify_code_db(email=email, code=code)

    if not is_valid:
        return jsonify({"message": 'Código inválido o expirado.', 'success': False})

    return jsonify({"message": "Código verificado correctamente.", "success": True}), 200

@jwts.token_required
def reset_password_via_code():
    """
    Reinicia la contraseña desde la pantalla de "Olvide mi contraseña"
    """
    user_data = request.get_json()

    password = user_data.get('newPassword')
    email = request.current_user.get('email')

    if not password:
        return jsonify({"message": 'La contraseña o el correo son requeridos.', 'success':False})

    hashed_password = auth_service.hash_password(password=password)

    update_result = auth_service.reset_password(email=email, new_password=hashed_password)

    if not update_result:
        return jsonify({"message": 'error al actualizar contraseña.', 'success':False})
    
    return update_result





