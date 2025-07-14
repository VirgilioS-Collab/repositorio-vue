import jwt
import os 
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify

class JWTService:
    """ Servicio para manejar operaciones relacionadas con JWT"""
    SECRET_KEY = os.getenv("JWT_SECRET_KEY") 
    ALGORITHM = "HS256"
    DEFAULT_EXPIRE_SECONDS = 300
    JWT_ISSUER = os.getenv("JWT_ISSUER")


    @classmethod
    def create_token(cls, user_data : dict, expires_in=None, type="access", jti:str = None):
        """Creacion del JWT con los datos del usuario que inicio sesion"""
        expires_seconds = expires_in if expires_in is not None else cls.DEFAULT_EXPIRE_SECONDS

        payload = {
            **user_data,
            "exp": datetime.now(timezone.utc) + timedelta(seconds=expires_seconds),
            "iss": cls.JWT_ISSUER,
            "type": type
        }

        if type == 'refresh':
            payload['jti'] = jti

        return jwt.encode(payload, cls.SECRET_KEY, algorithm=cls.ALGORITHM)
    
    @classmethod
    def verify_token(cls, token):
        """
        Verificar y decoficar un JWT
        """
        try:
            return jwt.decode(token, cls.SECRET_KEY, algorithms=[cls.ALGORITHM])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    @staticmethod
    def token_required(expected_type):
        """
        Decorador para proteger rutas que requieren autenticación vía JWT.
        Permite especificar el tipo de token esperado (access, refresh, reset_pass).
        """
        def decorator(f):
            @wraps(f)
            def decorator_function(*args, **kwargs):
                token = None
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith('Bearer ') and expected_type != 'refresh':
                    token = auth_header.split(' ')[1]
                else:
                    token = request.cookies.get('refresh_token')
                if not token:
                    return jsonify({"error": "Falta el token o está mal formado"}), 401 
                try:
                    data = JWTService.verify_token(token)
                    if not data:
                        return jsonify({"error": "Token es invalido o expirado"}), 401
                    
                    if data.get("type") != expected_type:
                        return jsonify({
                            "error": f"Tipo de Toke invalido. Esperado '{expected_type}', se obtuvo'{data.get('type')}'"
                        }), 401
                    
                    request.current_user = data

                except Exception as e:
                    return jsonify({"error": f"Token processing error: {str(e)}"}), 401
                return f(*args, **kwargs)
            return decorator_function
        return decorator