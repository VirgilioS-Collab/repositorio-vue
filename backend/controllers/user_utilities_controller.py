from flask import request, jsonify
from services import user_utilities_service as uus
from services.jwt_service import JWTService as jwts

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



    
