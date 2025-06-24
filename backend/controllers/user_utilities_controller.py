from flask import request, jsonify
from services import user_utilities_service as uus
from services.jwt_service import JWTService as jwts

@jwts.token_required
def change_password():
    """
    Cambia la contraseña del usuario autenticado usando el token JWT.
    """
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    # Validación de datos de entrada
    if not current_password or not new_password:
        return jsonify({"success": False, "message": "Datos incompletos"}), 400

    user_id = request.current_user.get("user_id")

    # Obtener contraseña actual desde la BD
    hashed_password, found = uus.get_user_encrypted_password(user_id=user_id)

    if not found:
        return jsonify({"success": False, "message": "El usuario no fue encontrado"}), 404

    if not uus.validate_password(current_password, hashed_password):
        return jsonify({"success": False, "message": "La contraseña no coincide"}), 401

    # Actualizar contraseña
    new_hashed = uus.hash_password(new_password)
    message, success = uus.update_user_password(user_id=user_id, hashed_password=new_hashed)

    if not success:
        return jsonify({"success": False, "message": message}), 500

    # Invalidar tokens antiguos
    cleanup_msg, _ = uus.deactivate_user_tokens(user_id=user_id)

    return jsonify({
        "success": True,
        "message": "Contraseña actualizada correctamente.",
        "token_cleanup": cleanup_msg
    }), 200



    
