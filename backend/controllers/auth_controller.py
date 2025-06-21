from flask import request, jsonify
from services import auth_service

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
        response = {
            'user_id': user_data[0],
            'username': user_data[1],
            'email': user_data[2],
            'name': user_data[3],
            'last_name': user_data[4],
            'profile_photo_url': user_data[5],
            'user_type': user_data[6],
            'user_status': user_data[7],
            'success': True,
            'message': 'Login exitoso'
                }
        return jsonify(response), 200
    
    return jsonify({"success": False, "message": "Contraseña incorrecta"}), 401

def create_user() -> tuple:
    """
    Creacion de usuario
    """
    data = request.get_json()

    user_data = auth_service.create_user_db(data)

    if user_data and user_data[4]:
        return jsonify({
        "username": user_data[0],   
        "email": user_data[1],      
        "message": user_data[2],    
        "success": user_data[3],    
        "user_id": user_data[4]     
                }), 201
    else:
        return jsonify({
            "success": False,
            "message": user_data[2] if user_data else "Error desconocido al crear usuario"
                }), 400








