from utils.db import get_connection
from utils.security import hash_password, validate_password

def login_user_db(username:str = None, email:str = None) -> tuple:
    """Autentica un usuario en la base de datos usando nombre de usuario o email."""
    try:
        conn = get_connection()
    except Exception as e:
        print(e)
        
    cursor = conn.cursor()

    cursor.callproc("public.user_login", (username, email))

    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result

def create_user_db(enroll_data: dict) -> tuple:
    """Registro del usuario a nivel de Base de Datos."""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        hashed_password = hash_password(enroll_data['password'])

        cursor.execute("""
            CALL public.sp_create_user(
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        """, (
            enroll_data["firstName"],
            enroll_data["lastName"],
            enroll_data["username"],
            enroll_data["email"],
            enroll_data.get("phone"),
            enroll_data.get("about_me"),
            hashed_password,
            enroll_data.get("profile_photo_url"),
            1,  # user type por defecto
            1   # status activo
        ))

        result = cursor.fetchone()
        conn.commit()
        return result

    except Exception as e:
        print(f"Error en create_user_db: {str(e)}")
        conn.rollback()
        return None

    finally:
        cursor.close()
        conn.close()

