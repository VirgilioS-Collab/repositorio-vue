from utils.db import get_connection
from utils.security import hash_password, validate_password

def get_user_encrypted_password(user_id:int) -> str:
    """Obtener la contraseña para comparar si es correcta antes de actualizar"""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.vw_get_user_password", (user_id,)) 

        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result

    except Exception as e:
        conn.rollback()
        return (str(e), False)
    finally:
        cursor.close()
        conn.close()
    
def update_user_password(user_id: int, hashed_password: str) -> tuple:
    """
    Actualizar la contraseña del usuario.
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()

        success:bool = True
        message:str = ''

        cursor.execute("CALL public.sp_update_user_password_by_userid(%s,%s, %s, %s)", (user_id, hashed_password, message, success))

        conn.commit()

        return (message, success)

    except Exception as e:
        if conn:
            conn.rollback()
            print(str(e))
        return (str(e), False)

    finally:
            cursor.close()
            conn.close()

def deactivate_user_tokens(user_id: int) -> tuple:
    """
    Desactivar los refresh tokens activos
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()

        success:bool = True
        message:str = ''

        cursor.execute("CALL public.sp_deactivate_user_tokens(%s, %s, %s)", (user_id, message, success))

        conn.commit()

        message, success = cursor.fetchone()

        return (message, success)

    except Exception as e:
        if conn:
            conn.rollback()
        print(str(e))
        return (str(e), False)

    finally:
        cursor.close()
        conn.close()
