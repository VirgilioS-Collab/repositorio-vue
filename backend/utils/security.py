import bcrypt

def hash_password(password: str) -> str:
    """Codificacion de la contraseña"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def validate_password(input_password: str, hashed_password: str) -> bool:
    """Validar si la contraseña es correcta"""
    return bcrypt.checkpw(input_password.encode(), hashed_password.encode())
