import bcrypt
import random
import os
from dotenv import load_dotenv
load_dotenv()

def hash_password(password: str) -> str:
    """Codificacion de la contraseña"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def validate_password(input_password: str, hashed_password: str) -> bool:
    """Validar si la contraseña es correcta"""
    return bcrypt.checkpw(input_password.encode(), hashed_password.encode())

def gen_random_fp_code() -> int:
    return str(random.randint(100000, 999999))

def cookies_config() -> dict:
    """Configuracion de cookies refresh token"""
    return({'SESSION_COOKIE_HTTPONLY': os.getenv('SESSION_COOKIE_HTTPONLY'),
            'SESSION_COOKIE_SECURE': os.getenv('SESSION_COOKIE_SECURE'),
            'SESSION_COOKIE_SAMESITE': os.getenv('SESSION_COOKIE_SAMESITE')})

def auth_token_ttl():
    """Tiempo de vida del token de acceso
    Devuelve el tiempo de vida del token de acceso en segundos."""
    return int(os.getenv('ACCESS_TOKEN_EXPIRES', 900)) #default 15 minutos

def reset_token_ttl():
    """Tiempo de vida del token de restablecimiento de contraseña
    Devuelve el tiempo de vida del token de restablecimiento de contraseña en segundos."""
    return int(os.getenv('RESET_PASS_TOKEN_EXPIRES', 600)) #default 10 minutos

def refresh_token_ttl():
    """Tiempo de vida del token de actualización
    Devuelve el tiempo de vida del token de actualización en segundos."""
    return int(os.getenv('REFRESH_TOKEN_EXPIRES', 604800)) #default 7 dias