"""
Activity Service
Maneja la lógica de negocio para las actividades
"""
from utils.db import get_connection, null_parse
from typing import List, Dict, Any, Optional
from datetime import datetime

class ActivityService:
    @staticmethod
    def get_all_activities() -> List[Dict[str, Any]]:
        """
        Obtiene todas las actividades disponibles en la base de datos.
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()

            cursor.execute("SELECT * FROM public.fn_get_all_activities()")
            activities = cursor.fetchall()

            # Convertir a lista de diccionarios
            result = []
            for activity in activities:
                result.append({
                    'activity_id': activity[0],
                    'activity_name': activity[1],
                    'activity_description': activity[2],
                    'max_participants': activity[3],
                    'group_id': activity[4],
                    'creator_name': activity[5],
                    'activity_datetime': activity[6] if activity[6] else None,
                    'location': activity[7],
                    'participants_count': activity[8],
                    'activity_type_name': activity[9],
                    'activity_status_name': activity[10],
                    'group_name': activity[11]
                })

            cursor.close()
            connection.close()
            return result

        except Exception as e:
            print(f"Error getting all activities: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
    @staticmethod
    def get_activity_by_id(activity_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene los detalles de una actividad específica por su ID
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()

            cursor.callproc("public.fn_get_activity_by_id", (activity_id,))
            activity = cursor.fetchone()
            
            if not activity:
                cursor.close()
                connection.close()
                return None
            
            result = {
                'activity_id': activity[0],
                'activity_name': activity[1],
                'activity_description': activity[2],
                'max_participants': activity[3],
                'creator_name': activity[4],
                'activity_datetime': activity[5] if activity[5] else None,
                'location': activity[6],
                'participants_count': activity[7],
                'activity_type_name': activity[8],
                'activity_status_name': activity[9],
                'group_name': activity[10]
            }

            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting activity by id: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
    @staticmethod
    def get_activities_by_group(group_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todas las actividades de un grupo específico
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()

            cursor.callproc("public.fn_get_activities_by_group", (group_id,))          
            activities = cursor.fetchall()
            
            result = []
            for activity in activities:
                result.append({
                    'activity_id': activity[0],
                    'activity_name': activity[1],
                    'activity_description': activity[2],
                    'max_participants': activity[3],
                    'creator_name': activity[4],
                    'activity_datetime': activity[5] if activity[5] else None,
                    'location': activity[6],
                    'participants_count': activity[7],
                    'activity_type_name': activity[8],
                    'activity_status_name': activity[9],
                    'group_name': activity[10]
                })

            cursor.close()
            connection.close()
            return result
        except Exception as e:
            print(f"Error getting activities by group: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
    @staticmethod
    def get_activities_by_club_admin(club_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todas las actividades de un club específico para los panales de administración
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            cursor.callproc("public.fn_get_activities_by_club_admin", (club_id,))
            activities = cursor.fetchall()
            
            result = []
            for activity in activities:
                result.append({
                'activity_id': activity[0],
                'activity_name': activity[1],
                'activity_description': activity[2],
                'max_participants': activity[3],
                'schedules': activity[4],
                'location': activity[5],
                'participants_count': activity[6],
                'activity_type_name': activity[7],
                'activity_status_name': activity[8],
                'group_name': activity[9]})
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting activities by club admin: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
    @staticmethod
    def create_activity(club_id: int, activity_data: Dict[str, Any], creator_id: int) -> Optional[Dict[str, Any]]:
        """
        Crea una nueva actividad
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()      
            cursor.callproc('public.fn_create_activity', (
                club_id,
                creator_id,
                activity_data.get('activity_name'),
                activity_data.get('activity_description'),
                activity_data.get('max_participants'),
                activity_data.get('activity_type'),
                activity_data.get('start_date'),
                activity_data.get('end_time'),
                activity_data.get('location')
            ))
            
            success, message = cursor.fetchone()
            connection.commit()
            
            cursor.close()
            connection.close()

            # Retornar la actividad creada
            return (message,  success)
            
        except Exception as e:
            return None
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
    @staticmethod
    def update_activity(activity_id: int, user_id:int, activity_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza los detalles de una actividad existente
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()

            name = null_parse(activity_data.get('name'))
            description = null_parse(activity_data.get('description'))
            max_participants = null_parse(activity_data.get('max_participants'))
            activity_type = null_parse(activity_data.get('activity_type'))
            start_datetime = null_parse(activity_data.get('start_datetime'))
            end_datetime = null_parse(activity_data.get('end_datetime'))
            location = null_parse(activity_data.get('location'))

            cursor.callproc('public.fn_update_activity',(activity_id, 
                                                        user_id,
                                                        name,
                                                        description,
                                                        max_participants,
                                                        activity_type,
                                                        start_datetime,
                                                        end_datetime,
                                                        location))
              
            connection.commit()
            success, message = cursor.fetchone()
            cursor.close()
            connection.close()

            return success, message

        except Exception as e:
            return (False, 'Se ha producido un error en la actualizacion.')
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
    @staticmethod
    def delete_activity(activity_id: int, user_id: int) -> tuple[bool, str]:
        """
        Elimina una actividad existente
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()

            cursor.callproc('public.fn_delete_activity',(
                activity_id,
                user_id
            ))

            connection.commit()
            success, message = cursor.fetchone()
            
            cursor.close()
            connection.close()
            
            return (success, message)
            
        except Exception as e:
            return (False, 'Se ha producido un error al eliminar la actividad.')
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
