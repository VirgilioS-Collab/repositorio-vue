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















