from flask import request, jsonify
import requests
from services import user_utilities_service as uus
from services.jwt_service import JWTService as jwts
from dotenv import load_dotenv
from PIL import Image
import io
import os
load_dotenv()

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


def update_user_information():
    pass

@jwts.token_required('access')
def upload_user_pfp():
    image = request.files['image']
    payload = request.current_user
    user_id = payload['user_id']

    # Tamaño predeterminado para las imágenes cuadradas
    size = int(os.getenv('IMGUR_IMAGE_SQUARE_SIZE'))

    try:
        # Procesamiento de imagen
        img = Image.open(image)
        width, height = img.size

        #Redimensionar las imagenes cuando no tienen lados iguales
        if width != height:
            #el lado mas corto de la imagen
            min_dim = min(width, height)
            #Obtener la diferencia de tamaño de cada lado
            left, top = (width - min_dim)/2, (height - min_dim)/2,
            right, bottom = (width + min_dim)/2, (height + min_dim)/2
            img = img.crop((left, top, right, bottom))

        img = img.resize((size, size), Image.Resampling.LANCZOS)
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)

    except Exception as e:
        return jsonify({"error": f"Error procesando la imagen: {str(e)}", 'success': False}), 400

    # Subir a Imgur
    headers = {'Authorization': f"Client-ID {os.getenv('IMGUR_CLIENT_ID')}"}
    files = {'image': ('image.jpg', img_byte_arr, 'image/jpeg')}
    response = requests.post(os.getenv('IMGUR_ENDPOINT'), headers=headers, files=files)

    img.close()
    img_byte_arr.close()

    if response.status_code == 200:
        link = response.json()['data']['link']
        try:
            uus.update_user_photo_in_db(user_id, link)
        except Exception as db_error:
            return jsonify({
                "profile_photo_url": link,
                "message": "Imagen subida pero no se pudo guardar en la base de datos",
                "success": False
            }), 500

        return jsonify({
            "profile_photo_url": link,
            "success": True
        }), 200
    else:
        return jsonify({"error": "Error al subir la imagen", 'success': False}), 500
