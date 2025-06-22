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
    def create_token(cls, user_data : dict, expires_in=None):
        """Creacion del JWT con los datos del usuario que inicio sesion"""
        expires_seconds = expires_in if expires_in is not None else cls.DEFAULT_EXPIRE_SECONDS

        payload = {
            **user_data,
            "exp": datetime.now(timezone.utc) + timedelta(seconds=expires_seconds),
            "iss": cls.JWT_ISSUER
        }

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
    def token_required(f):
        """
        Decorador para proteger rutas que requieren autenticación via JWT
        """
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({"error": "Token is missing"}), 401

            try:
                if token.startswith('Bearer '):
                    token = token[7:].strip()
                
                data = JWTService.verify_token(token)
                if not data:
                    return jsonify({"error": "Token is invalid or expired"}), 401
                
                request.current_user = data
            except Exception as e:
                return jsonify({"error": str(e)}), 401

            return f(*args, **kwargs)
        return decorated_function
    
    @classmethod
    def create_refresh_token(cls, user_data, expires_in=604800):
        expires_seconds = expires_in if expires_in is not None else cls.DEFAULT_EXPIRE_SECONDS
        payload = {
            **user_data,
            "exp": datetime.now(timezone.utc) + timedelta(seconds=expires_seconds),
            "iss": cls.JWT_ISSUER,
            "type": "refresh"
        }
        return jwt.encode(payload, cls.SECRET_KEY, algorithm=cls.ALGORITHM)