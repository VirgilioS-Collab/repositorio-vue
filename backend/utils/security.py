import bcrypt
import random
def hash_password(password: str) -> str:
    """Codificacion de la contraseña"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def validate_password(input_password: str, hashed_password: str) -> bool:
    """Validar si la contraseña es correcta"""
    return bcrypt.checkpw(input_password.encode(), hashed_password.encode())

def gen_random_fp_code() -> int:
    return str(random.randint(100000, 999999))