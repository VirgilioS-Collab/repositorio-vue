from utils.db import get_connection
from utils.security import hash_password, validate_password, gen_random_fp_code
from utils.mail import send_email_code

def login_user_db(username:str = None, email:str = None) -> tuple:
    """Autentica un usuario en la base de datos usando nombre de usuario o email."""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.user_login", (username, email))
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


def create_user_db(enroll_data: dict) -> tuple:
    """Registro del usuario a nivel de Base de Datos."""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        hashed_password = hash_password(enroll_data.get('password'))

        message = ''
        
        cursor.execute("""
            CALL public.insert_user(
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        """, (
            enroll_data.get("firstName"),
            enroll_data.get("lastName"),
            enroll_data.get("username"),
            enroll_data.get("email"),
            enroll_data.get("phone"),
            hashed_password,
            enroll_data.get("birthDate"),
            enroll_data.get("docNumber"),
            enroll_data.get("docType"),
            enroll_data.get("gender"),
            message
        ))

        message = cursor.fetchone()[0]

        conn.commit()

        return (message, True) 

    except Exception as e:
        conn.rollback()
        return (str(e), False)

    finally:
        cursor.close()
        conn.close()

def create_user_refresh_token_db(user_data:dict):
    """Registrar un nuevo Refresh token asociado 
    al usuario a nivel de base de datos"""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        success:bool = True
        message:str = ''
        
        cursor.execute("""
            CALL public.sp_create_user_refresh_token(%s, %s, %s, %s)
        """, (
            user_data.get('user_id'),
            user_data.get('refresh_token'),
            message,
            success
        ))     
        message = cursor.fetchone()[0]

        conn.commit()

        return (message, success) 
    
    except Exception as e:
        conn.rollback()
        return (str(e), False)

    finally:
        cursor.close()
        conn.close()

def verify_email_db(email: str) -> bool:
    """verifica si hay un usuario registrado con el correo en la base de datos"""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.vw_verifiy_mail_existance", (email,))
        success = cursor.fetchone()[0]
        conn.commit()

        return success

    except Exception as e:
        print(f"Error en verify_email_db: {e}")
        conn.rollback()
        return False

    finally:
        cursor.close()
        conn.close()


def email_code_insert_db(email: str, code: int, expires_in=10) -> bool:
    """insertar el codigo generado en base de datos"""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.sp_insert_verification_code", (email, code, expires_in))
        success = cursor.fetchone()[0]
        conn.commit()

        return success

    except Exception as e:
        print(f"Error en email_code_insert_db: {e}")
        conn.rollback()
        return False

    finally:
        cursor.close()
        conn.close()


def verify_code_db(email: str, code: int) -> bool:
    """Verificar si el codigo es correcto"""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.sp_verify_mail_code", (email, code))
        success = cursor.fetchone()[0]
        conn.commit()

        return success

    except Exception as e:
        print(f"Error en verify_code_db: {e}")
        conn.rollback()
        return False

    finally:
        cursor.close()
        conn.close()

def reset_password(email, new_password)->bool:
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.fn_update_user_password_by_email", (email, new_password))
        result = cursor.fetchone()
        conn.commit()

        if result:
            return{'message': result[0], "success": result[1]}

    except Exception as e:
        print(f"Error en reset_password: {e}")
        conn.rollback()
        return {"message": f"Error: {str(e)}", "success": False}

    finally:
        cursor.close()
        conn.close()