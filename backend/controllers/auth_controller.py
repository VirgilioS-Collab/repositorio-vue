from flask import request, jsonify, make_response
import uuid
from services import auth_service
from services.jwt_service import JWTService as jwts
from emails.email_types import verification_code_email as vce
from emails.email_types import welcome

#Constantes
REFRESH_TOKEN_EXPIRES = auth_service.refresh_token_ttl()
ACCESS_TOKEN_EXPIRES = auth_service.auth_token_ttl()
RESET_PASS_TOKEN_EXPIRES = auth_service.reset_token_ttl() 
COOKIES_CONFIG = auth_service.cookies_config() #Configuracion de cookies

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
    
    if auth_service.validate_password(input_password=password, hashed_password=user_data[3]):
    
        user_payload =  {
            'user_id': user_data[0],
            'username': user_data[1],
            'email': user_data[2]
        }
        access_token = jwts.create_token(user_data=user_payload,
                                        expires_in=ACCESS_TOKEN_EXPIRES,
                                        type='access')
        #Generar un identificador unico del JWT para manejar estados
        new_jti = str(uuid.uuid4())

        refresh_token = jwts.create_token(user_data=user_payload, 
                                          expires_in=REFRESH_TOKEN_EXPIRES, #7 dias
                                          type='refresh',
                                          jti=new_jti)

        token_result = auth_service.create_user_refresh_token_db(user_data={'user_id': user_data[0],
                                                                            'jti': new_jti})
        
        if token_result[1] is False:
            return jsonify({'message': token_result[0], 'success': False})
        

        response = make_response(jsonify({
            'login_success': True,
            'message': 'Login exitoso',
        "token": access_token}))
        #Establecer la cookie para el refresh token
        response.set_cookie(
            'refresh_token',
            value=refresh_token,
            httponly=COOKIES_CONFIG.get('SESSION_COOKIE_HTTPONLY'),
            secure=COOKIES_CONFIG.get('SESSION_COOKIE_SECURE'),
            samesite=COOKIES_CONFIG.get('SESSION_COOKIE_SAMESITE'),
            max_age= REFRESH_TOKEN_EXPIRES,
            path='/' #se maneja asi porque el user/changepassword debe acceder a la cookie
        )
        return response

    else:
        return jsonify({"success": False, "message": "Contraseña incorrecta"}), 401
    
@jwts.token_required("access")
def get_user_information():
    """Obtener la información principal del usuario autenticado"""
    try:
        user_id = request.current_user.get("user_id")

        user_info = auth_service.get_user_info_db(user_id=user_id)

        if not user_info:
            return jsonify({"message": "No se encontró información del usuario.", "success": False}), 404

        user_dto = {
            "username": user_info.get("username"),
            "email": user_info.get("email"),
            "name": user_info.get("name"),
            "last_name": user_info.get("last_name"),
            "phone": user_info.get("phone"),
            "about_me": user_info.get("about_me"),
            "gender": user_info.get("gender"),
            "birth_date": user_info.get("birth_date").isoformat() if user_info.get("birth_date") else None,
            "doc_number": user_info.get("doc_number"),
            "doc_type": user_info.get("doc_type"),
            "profile_photo_url": user_info.get("profile_photo_url"),
            "user_type": user_info.get("user_type"),
            "user_status": user_info.get("user_status"),
            "career": user_info.get("career")
        }

        return jsonify(user_dto), 200

    except Exception as e:
        return jsonify({
            "message": f"Ocurrió un error al obtener la información del usuario: {str(e)}",
            "success": False
        }), 500


@jwts.token_required("refresh")
def user_refresh_token():
    """
    Crea un nuevo access token usando un refresh token válido.
    """
    payload = request.current_user

    auth_jti_result = auth_service.verify_auth_refresh({'user_id': payload['user_id'], 'jti': payload['jti']})

    if auth_jti_result[1]:
        new_access_token = jwts.create_token({
            "user_id": payload["user_id"],
            "username": payload["username"],
            "email": payload["email"]}, 
        expires_in=ACCESS_TOKEN_EXPIRES,
        type='access')

        return jsonify({
            "token": new_access_token
        }), 200
    
    return jsonify({
            "message": auth_jti_result[0],
            'success': False}), 401
        

@jwts.token_required("refresh")
def logout() ->tuple:
    """
    Función para hacer logout
    """
    payload = request.current_user
    user_id = payload.get('user_id')
 
    result = auth_service.revoke_user_sessions(user_id)

    if not result[1]:
        return jsonify({"message": f'Error al cerrar sesion: {result[0]}', "success": False}), 500
    
    return jsonify({"message": "Logout exitoso", "success": True}), 200

def create_user() -> tuple:
    """
    Creacion de usuario
    """
    data = request.get_json()

    message, success = auth_service.create_user_db(data)

    if success:
        full_name = f'{data.get("firstName")} {data.get("lastName")}'.strip()
        email = data.get('email', '')
        if welcome.send_welcome_email(recipient=email, user_name=full_name):
            return jsonify({
                "message": message,
                "success": True
            }), 201
        
        else:
            return jsonify({
                "message": 'usuario creado exitosamente. Fallo en la mensajeria.',
                "success": True
            }), 201

    else:
        return jsonify({
            "success": False,
            "message": message
        }), 400

def user_forgot_password():
    """Envio de código de autenticación al correo electronico"""
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message':'el email es requerido.', 'success': False})
    
    if not auth_service.verify_email_db(email=email):
        return jsonify({'message': 'el correo no existe.', 'success': False})
    
    code = auth_service.gen_random_fp_code()

    inserted = auth_service.email_code_insert_db(email, code, expires_in=10)

    if not inserted:
        return jsonify({'message': 'No se pudo generar el código.', 'success': False}), 500

    reset_token = jwts.create_token(user_data={'email': email}, expires_in=RESET_PASS_TOKEN_EXPIRES, type='reset_pass')

    return jsonify({'message': 'codigo enviado exitosamente.', 'token': reset_token,'success': True}), 200

@jwts.token_required("reset_pass")
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

@jwts.token_required("reset_pass")
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
