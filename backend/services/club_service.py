"""
Club Service
Maneja la lógica de negocio para los clubs/grupos
"""
from utils.db import get_connection, null_parse
from typing import Dict, Any, Optional
class ClubService:
    
    @staticmethod
    def get_club_details(club_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene los detalles de un club/grupo específico por su ID
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            cursor.callproc('public.fn_get_club_details', (club_id,))
            club = cursor.fetchone()
            
            if not club:
                cursor.close()
                connection.close()
                return None

            result = {
                'group_id': club[0],
                'group_name': club[1],
                'group_description': club[2],
                'owner_name': club[3],
                'creation_date': club[4].isoformat() if club[4] else None,
                'logo_url': club[5],
                'group_contact': club[6],
                'group_type_name': club[7],
                'group_status_name': club[8],
                'members_count': club[9]
            }
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting club details: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
    @staticmethod
    def update_club_settings(club_id: int, user_id:int, settings_data: Dict[str, Any]) -> tuple[str, bool]:
        """
        Actualiza los ajustes generales de un club
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            name = null_parse(settings_data.get('name'))
            description = null_parse(settings_data.get('description'))
            status_id = null_parse(settings_data.get('status'))
            category = null_parse(settings_data.get('category'))
            logo_url = null_parse(settings_data.get('logo_url'))

            # Llamar a la función
            cursor.callproc(
                'public.fn_update_club_settings',
                (user_id,
                club_id, 
                name,
                description,
                status_id, 
                category, 
                logo_url))

            connection.commit()
            message, success = cursor.fetchall()[0]
            cursor.close()
            connection.close()
            
            return (message, success)
            
        except Exception as e:
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    @staticmethod
    def get_all_clubs():
        """
        Obtiene todos los clubes/grupos disponibles
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            cursor.callproc('public.fn_get_all_clubs')
            clubs = cursor.fetchall()

            result = []
            for club in clubs:
                result.append({
                    'group_id': club[0],
                    'group_name': club[1],
                    'group_description': club[2],
                    'owner_name': club[3],
                    'creation_date': club[4].isoformat() if club[4] else None,
                    'logo_url': club[5],
                    'group_type_name': club[6],
                    'group_status_name': club[7],
                    'members_count': club[8]
                })
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting all clubs: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    @staticmethod   
    def get_user_related_groups(user_id:int) -> Optional[list[Dict[str, Any]]]:
        """Obtiene los grupos relacionados al usuario por user_id"""
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc("public.fn_get_user_related_groups", (user_id, ))

            result = cursor.fetchall()

            columns = [desc[0] for desc in cursor.description]
            groups = [dict(zip(columns, row)) for row in result]

            return groups
        
        except Exception as e:
            if conn:
                conn.rollback()
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    @staticmethod
    def request_group_join_db(user_id: int, club_id:int) -> tuple[str, bool]:
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc("public.fn_request_group_join", (user_id, club_id))

            conn.commit()
            message, success = cursor.fetchone()

            return (message, success)
        
        except Exception as e:
            if conn:
                conn.rollback()
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
            
    @staticmethod
    def create_club_db (group_name:str, group_desc:str, owner_id:int, group_category: str, max_group_per_user:int, contact_info:list) -> tuple[str, bool]:
        """
        Crea un nuevo club/grupo en la base de datos
        """
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc("public.fn_create_group", (group_name, group_desc, owner_id, group_category, max_group_per_user, null_parse(contact_info)))

            conn.commit()
            message, success = cursor.fetchone()

            return (message, success)
        
        except Exception as e:
            if conn:
                conn.rollback()
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    @staticmethod
    def update_group_photo_in_db(group_id: int, user_id:int, pfp_url: str) -> tuple[str, bool]:
        """
        Actualiza la foto de perfil del grupo en la base de datos
        """
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc("public.fn_update_group_profile_photo", (user_id, group_id, pfp_url))

            conn.commit()
            message, success = cursor.fetchone()

            return (message, success)
        
        except Exception as e:
            if conn:
                conn.rollback()
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()


#Administracion
    @staticmethod
    def reactivate_club_db(club_id: int, user_id: int) -> tuple[str, bool]:
        """
        Reactiva un club/grupo eliminado
        """
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc("public.fn_adm_activate_group", (user_id, club_id))

            conn.commit()
            message, success = cursor.fetchone()

            return (message, success)
        
        except Exception as e:
            if conn:
                conn.rollback()
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    @staticmethod
    def get_administration_member_status(club_id: int) -> tuple[str, bool]:
        """
        Obtiene el estado de los miembros de un club para la administración
        """
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc('public.fn_adm_get_member_status', (club_id, ))

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
    
    @staticmethod
    def get_adm_weekly_activity_heatmap(club_id: int) -> tuple[str, bool]:
        """
        Obtiene un mapa de calor semanal de actividades del club para la administración
        """
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc('public.fn_adm_weekly_activity_heatmap', (club_id, ))

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

    @staticmethod
    def get_adm_activity_enrollment_stats(club_id: int) -> tuple[str, bool]:
        """
        Obtiene estadísticas de inscripción en actividades del club para la administración
        """
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc('public.fn_adm_activity_enrollment_stats', (club_id, ))

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

    @staticmethod
    def get_club_members(club_id: int) -> tuple[str, bool]:
        """
        Obtiene la lista de miembros de un club por su ID
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            cursor.callproc('public.fn_adm_get_club_members', (club_id,))
            members = cursor.fetchall()

            result = []
            for member in members:
                result.append({
                    'username': member[0],
                    'first_name': member[1],
                    'last_name': member[2],
                    'role_name': member[3],
                    'status_name': member[4]
                })
            
            cursor.close()
            connection.close()
            return result

        except Exception as e:
            if connection:
                connection.rollback()
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    @staticmethod
    def get_club_pending_approvals(club_id: int) -> tuple[str, bool]:
        """Obtiene las solicitudes de aprobación pendientes para un club específico"""
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc('public.fn_adm_pending_approval_requests', (club_id, ))

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

    @staticmethod
    def update_pending_request(club_id: int, request_id:int, approval_user_id: int, action: str) -> dict[str, Any]:
        """
        Actualiza el estado de una solicitud de unión pendiente a un club.
        """
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc('public.fn_adm_update_pending_request', (club_id, request_id, approval_user_id, action))
            conn.commit()

            message, success, was_approved, approved_user_data = cursor.fetchone()

            return {
            'message': message,
            'success': success,
            'was_approved': was_approved,
            'user_data': approved_user_data}

        except Exception as e:
            if conn:
                conn.rollback()
            return {
                'message': str(e),
                'success': False,
                'was_approved': None,
                'approved_user_data': None}
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    @staticmethod
    def delete_club_db(club_id: int, user_id: int) -> tuple[str, bool]:
        """
        Elimina un club/grupo de la base de datos
        """
        try:
            conn = get_connection()
            cursor = conn.cursor()

            cursor.callproc("public.fn_adm_delete_group", (user_id, club_id))

            conn.commit()
            message, success = cursor.fetchone()

            return (message, success)
        
        except Exception as e:
            if conn:
                conn.rollback()
            return (str(e), False)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()