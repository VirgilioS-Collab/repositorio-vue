from utils.db import get_connection, null_parse
from utils.security import hash_password, validate_password
from .auth_service import verify_auth_refresh

def get_user_encrypted_password(user_id:int) -> tuple[str | None, bool]:
    """Obtener la contraseña para comparar si es correcta antes de actualizar"""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.vw_get_user_password", (user_id,)) 
        result = cursor.fetchone()

        return result

    except Exception as e:
        conn.rollback()
        return (str(e), False)
    finally:
        cursor.close()
        conn.close()

def update_user_photo_in_db(user_id: int, pfp_url: str) -> tuple[str, bool]:
    """Actualizar la foto de perfil de usuario en la base de datos."""
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("public.fn_update_user_profile_photo", (user_id, pfp_url))
        conn.commit()
        result = cursor.fetchone()
        return result

    except Exception as e:
        conn.rollback()
        return (str(e), False)
    finally:
        cursor.close()
        conn.close()

def update_user_password(user_id: int, hashed_password: str) -> tuple[str, bool]:
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

def deactivate_user_tokens(user_id: int) -> tuple[str, bool]:
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

def update_user_personal_info(user_id: int, user_data: dict) -> tuple[str, bool]:
    """
    Actualizar la informacion personal del usuario
    """
    try:
        conn = get_connection()
        cursor = conn.cursor()
        p_name = null_parse(user_data.get('name'))
        p_last_name = null_parse(user_data.get('last_name'))
        p_email = null_parse(user_data.get('email'))
        p_phone = null_parse(user_data.get('phone'))
        p_about_me = null_parse(user_data.get('about_me'))
        career = null_parse(user_data.get('career'))

        cursor.callproc("public.fn_update_user_personal_info", (
            user_id,
            p_name,
            p_last_name,
            p_email,
            p_phone,
            p_about_me,
            career
        ))
        conn.commit()
        success = cursor.fetchone()[0]
        message = 'Datos actualizados correctamente.' if success else 'No se han podido actualizar los datos.'

        return (message, success)

    except Exception as e:
        if conn:
            conn.rollback()
        print(str(e))
        return (str(e), False)

    finally:
        cursor.close()
        conn.close()

def get_user_notifications_db(user_id: int) -> dict[list[str]] | tuple[str | None, bool]:
        """Obtiene las notificaciones del usuario por user_id."""
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc('public.fn_sys_get_notifications', (user_id, ))

            result = cursor.fetchone()[0]

            return result

        except Exception as e:
            if conn:
                conn.rollback()
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

def update_user_notifications_bd(user_id: int, notification_ids:list) -> tuple[str | None, bool]:
        """Actualiza las notificaciones del usuario por user_id."""
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc('public.fn_sys_update_notifications', (user_id, notification_ids))
            conn.commit()
            result = cursor.fetchone()[0]

            return result

        except Exception as e:
            if conn:
                conn.rollback()
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

def get_user_related_activities(user_id:int) -> dict[list[str]] | tuple[str | None, bool]:
        """Obtiene las actividades relacionadas al usuario por user_id"""
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc("public.fn_get_user_related_activities", (user_id, ))

            result = cursor.fetchall()

            columns = [desc[0] for desc in cursor.description]
            activities = [dict(zip(columns, row)) for row in result]

            return activities
        
        except Exception as e:
            if conn:
                conn.rollback()
            return (str(e), False)
        
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

def join_activity(activity_id:int, user_id: int) -> tuple[bool, str, str]:
        """ Permite a un usuario unirse a una actividad específica."""
        try:
            connection = get_connection()
            cursor = connection.cursor()

            cursor.callproc('public.fn_join_activity',(
                activity_id,
                user_id
            ))

            connection.commit()
            success, message, data = cursor.fetchone()
            
            cursor.close()
            connection.close()
            
            return (success, message, data)
            
        except Exception as e:
            return (False, 'Error al unirse a la actividad', '')
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close() 
    
def leave_activity(activity_id:int, user_id: int) -> tuple[bool, str, str]:
            """ Permite a un usuario abandonar una actividad específica."""
            try:
                connection = get_connection()
                cursor = connection.cursor()

                cursor.callproc('public.fn_leave_activity',(
                    activity_id,
                    user_id
                ))

                connection.commit()
                success, message, data = cursor.fetchone()
                
                cursor.close()
                connection.close()
                
                return (success, message, data)
                
            except Exception as e:
                return (False, 'Error al abandonar la actividad', '')
            finally:
                if cursor:
                    cursor.close()
                if connection:
                    connection.close()
            
def get_upcoming_events(user_id: int) -> dict[list[str]] | tuple[str | None, bool]:
        """Obtiene los eventos próximos del usuario por user_id."""
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc('public.fn_user_upcoming_events', (user_id, ))
            conn.commit()
            result = cursor.fetchone()[0]

            return result

        except Exception as e:
            if conn:
                conn.rollback()
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()