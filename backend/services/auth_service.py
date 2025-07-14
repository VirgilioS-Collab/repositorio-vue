from utils.db import get_connection, null_parse
from utils.security import hash_password, validate_password, gen_random_fp_code, cookies_config

def login_user_db(username:str = None, email:str = None) -> tuple:
    """Autentica un usuario en la base de datos usando nombre de usuario o email."""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.fn_user_login", (null_parse(username), null_parse(email)))
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

def revoke_user_sessions(user_id:int) -> tuple:
    """Revoca el refresh token del usuario a nivel de 
    Base de datos."""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.fn_revoke_user_session", (user_id, ))

        result = cursor.fetchone()
        conn.commit()

        cursor.close()
        conn.close()

        return result
    
    except Exception as e:
        conn.rollback()
        return (str(e), False)
    finally:
        cursor.close()
        conn.close()

def verify_auth_refresh(auth_jti:dict) -> bool:
    """Verificar la autenticidad del token"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.callproc("public.verify_auth_refresh", (auth_jti['user_id'], auth_jti['jti']))

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

        cursor.callproc('public.fn_insert_user', (
            enroll_data.get("firstName"),
            enroll_data.get("lastName"),
            enroll_data.get("username"),
            enroll_data.get("email"),
            enroll_data.get("phone"),
            hashed_password,
            enroll_data.get("birthDate"),
            enroll_data.get("docNumber"),
            enroll_data.get("docType"),
            enroll_data.get("gender")))

        message, success = cursor.fetchone()
        conn.commit()

        return (message, success)

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
            user_data.get('jti'),
            message,
            success
        ))     
        message, success = cursor.fetchone()

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
        conn.rollback()
        return False

    finally:
        cursor.close()
        conn.close()

def reset_password(email, new_password)->tuple:
    """
    Metodo para reiniciar contraseña con correo.
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.fn_update_user_password_by_email", (email, new_password))
        result = cursor.fetchone()
        conn.commit()

        if result:
            return{'message': result[0], "success": result[1]}

    except Exception as e:
        conn.rollback()
        return {"message": f"Error: {str(e)}", "success": False}

    finally:
        cursor.close()
        conn.close()

def get_user_info_db(user_id: int) -> dict | None:
    """Obtiene la información del usuario por user_id."""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.fn_get_user_information", (user_id, ))

        row = cursor.fetchone()
        if row is None:
            return None

        columns = [desc[0] for desc in cursor.description]

        user_info = dict(zip(columns, row))

        return user_info

    except Exception as e:
        if conn:
            conn.rollback()
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
 
