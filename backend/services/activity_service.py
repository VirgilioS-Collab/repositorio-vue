"""
Activity Service
Maneja la lógica de negocio para las actividades
"""
from utils.db import get_connection
from typing import List, Dict, Any, Optional
from datetime import datetime

class ActivityService:
    
    @staticmethod
    def get_all_activities() -> List[Dict[str, Any]]:
        """
        Obtiene todas las actividades disponibles para estudiantes
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            query = """
            SELECT 
                a.activity_id,
                a.activity_name,
                a.activity_description,
                a.max_participants,
                a.activity_type_id,
                a.activity_status_id,
                a.group_id,
                a.creator_id,
                a.activity_datetime,
                a.location,
                (SELECT COUNT(*) FROM activity_participants ap WHERE ap.activity_id = a.activity_id) as participants_count,
                at.activity_type_name,
                ast.activity_status_name,
                g.group_name
            FROM activities a
            LEFT JOIN activity_types at ON a.activity_type_id = at.activity_type_id
            LEFT JOIN activity_statuses ast ON a.activity_status_id = ast.activity_status_id
            LEFT JOIN groups g ON a.group_id = g.group_id
            WHERE a.activity_status_id = 1  -- Solo actividades activas
            ORDER BY a.activity_datetime DESC
            """
            
            cursor.execute(query)
            activities = cursor.fetchall()
            
            # Convertir a lista de diccionarios
            result = []
            for activity in activities:
                result.append({
                    'activity_id': activity[0],
                    'activity_name': activity[1],
                    'activity_description': activity[2],
                    'max_participants': activity[3],
                    'activity_type_id': activity[4],
                    'activity_status_id': activity[5],
                    'group_id': activity[6],
                    'creator_id': activity[7],
                    'activity_datetime': activity[8].isoformat() if activity[8] else None,
                    'location': activity[9],
                    'participants_count': activity[10],
                    'activity_type_name': activity[11],
                    'activity_status_name': activity[12],
                    'group_name': activity[13]
                })
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting all activities: {e}")
            return []
        
    @staticmethod
    def get_user_related_activities(user_id:int) -> List[Dict]:
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
    
    @staticmethod
    def get_activity_by_id(activity_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene una actividad específica por su ID
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            query = """
            SELECT 
                a.activity_id,
                a.activity_name,
                a.activity_description,
                a.max_participants,
                a.activity_type_id,
                a.activity_status_id,
                a.group_id,
                a.creator_id,
                a.activity_datetime,
                a.location,
                (SELECT COUNT(*) FROM activity_participants ap WHERE ap.activity_id = a.activity_id) as participants_count,
                at.activity_type_name,
                ast.activity_status_name,
                g.group_name
            FROM activities a
            LEFT JOIN activity_types at ON a.activity_type_id = at.activity_type_id
            LEFT JOIN activity_statuses ast ON a.activity_status_id = ast.activity_status_id
            LEFT JOIN groups g ON a.group_id = g.group_id
            WHERE a.activity_id = %s
            """
            
            cursor.execute(query, (activity_id,))
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
                'activity_type_id': activity[4],
                'activity_status_id': activity[5],
                'group_id': activity[6],
                'creator_id': activity[7],
                'activity_datetime': activity[8].isoformat() if activity[8] else None,
                'location': activity[9],
                'participants_count': activity[10],
                'activity_type_name': activity[11],
                'activity_status_name': activity[12],
                'group_name': activity[13]
            }
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting activity by id: {e}")
            return None
    
    @staticmethod
    def get_activities_by_group(group_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todas las actividades de un grupo específico
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            query = """
            SELECT 
                a.activity_id,
                a.activity_name,
                a.activity_description,
                a.max_participants,
                a.activity_type_id,
                a.activity_status_id,
                a.group_id,
                a.creator_id,
                a.activity_datetime,
                a.location,
                (SELECT COUNT(*) FROM activity_participants ap WHERE ap.activity_id = a.activity_id) as participants_count,
                at.activity_type_name,
                ast.activity_status_name,
                g.group_name
            FROM activities a
            LEFT JOIN activity_types at ON a.activity_type_id = at.activity_type_id
            LEFT JOIN activity_statuses ast ON a.activity_status_id = ast.activity_status_id
            LEFT JOIN groups g ON a.group_id = g.group_id
            WHERE a.group_id = %s
            ORDER BY a.activity_datetime DESC
            """
            
            cursor.execute(query, (group_id,))
            activities = cursor.fetchall()
            
            result = []
            for activity in activities:
                result.append({
                    'activity_id': activity[0],
                    'activity_name': activity[1],
                    'activity_description': activity[2],
                    'max_participants': activity[3],
                    'activity_type_id': activity[4],
                    'activity_status_id': activity[5],
                    'group_id': activity[6],
                    'creator_id': activity[7],
                    'activity_datetime': activity[8].isoformat() if activity[8] else None,
                    'location': activity[9],
                    'participants_count': activity[10],
                    'activity_type_name': activity[11],
                    'activity_status_name': activity[12],
                    'group_name': activity[13]
                })
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting activities by group: {e}")
            return []
    
    @staticmethod
    def get_activities_by_club_admin(club_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todas las actividades de un club para el panel de administración
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            query = """
            SELECT 
                a.activity_id,
                a.activity_name,
                a.activity_description,
                a.max_participants,
                a.activity_type_id,
                a.activity_status_id,
                a.group_id,
                a.creator_id,
                a.activity_datetime,
                a.location,
                (SELECT COUNT(*) FROM activity_participants ap WHERE ap.activity_id = a.activity_id) as participants_count,
                at.activity_type_name,
                ast.activity_status_name,
                g.group_name
            FROM activities a
            LEFT JOIN activity_types at ON a.activity_type_id = at.activity_type_id
            LEFT JOIN activity_statuses ast ON a.activity_status_id = ast.activity_status_id
            LEFT JOIN groups g ON a.group_id = g.group_id
            WHERE g.club_id = %s  -- Asumiendo que hay una relación club_id en groups
            ORDER BY a.activity_datetime DESC
            """
            
            cursor.execute(query, (club_id,))
            activities = cursor.fetchall()
            
            result = []
            for activity in activities:
                result.append({
                    'activity_id': activity[0],
                    'activity_name': activity[1],
                    'activity_description': activity[2],
                    'max_participants': activity[3],
                    'activity_type_id': activity[4],
                    'activity_status_id': activity[5],
                    'group_id': activity[6],
                    'creator_id': activity[7],
                    'activity_datetime': activity[8].isoformat() if activity[8] else None,
                    'location': activity[9],
                    'participants_count': activity[10],
                    'activity_type_name': activity[11],
                    'activity_status_name': activity[12],
                    'group_name': activity[13]
                })
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting activities by club admin: {e}")
            return []
    
    @staticmethod
    def create_activity(club_id: int, activity_data: Dict[str, Any], creator_id: int) -> Optional[Dict[str, Any]]:
        """
        Crea una nueva actividad para un club
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            # Insertar la nueva actividad
            query = """
            INSERT INTO activities (
                activity_name, 
                activity_description, 
                max_participants, 
                activity_type_id, 
                activity_status_id, 
                group_id, 
                creator_id, 
                activity_datetime, 
                location
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            cursor.execute(query, (
                activity_data.get('activity_name'),
                activity_data.get('activity_description'),
                activity_data.get('max_participants'),
                activity_data.get('activity_type_id'),
                activity_data.get('activity_status_id', 1),  # Default: activa
                activity_data.get('group_id'),
                creator_id,
                activity_data.get('activity_datetime'),
                activity_data.get('location')
            ))
            
            # Obtener el ID de la actividad recién creada
            activity_id = cursor.lastrowid
            connection.commit()
            
            cursor.close()
            connection.close()
            
            # Retornar la actividad creada
            return ActivityService.get_activity_by_id(activity_id)
            
        except Exception as e:
            print(f"Error creating activity: {e}")
            return None
    
    @staticmethod
    def update_activity(activity_id: int, activity_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Actualiza una actividad existente
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            # Construir query dinámicamente solo con campos proporcionados
            update_fields = []
            values = []
            
            for field in ['activity_name', 'activity_description', 'max_participants', 
                         'activity_type_id', 'activity_status_id', 'group_id', 
                         'activity_datetime', 'location']:
                if field in activity_data:
                    update_fields.append(f"{field} = %s")
                    values.append(activity_data[field])
            
            if not update_fields:
                return ActivityService.get_activity_by_id(activity_id)
            
            values.append(activity_id)
            
            query = f"UPDATE activities SET {', '.join(update_fields)} WHERE activity_id = %s"
            
            cursor.execute(query, values)
            connection.commit()
            
            cursor.close()
            connection.close()
            
            # Retornar la actividad actualizada
            return ActivityService.get_activity_by_id(activity_id)
            
        except Exception as e:
            print(f"Error updating activity: {e}")
            return None
    
    @staticmethod
    def delete_activity(activity_id: int) -> bool:
        """
        Elimina una actividad
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            # Eliminar primero las dependencias (participantes)
            cursor.execute("DELETE FROM activity_participants WHERE activity_id = %s", (activity_id,))
            
            # Eliminar la actividad
            cursor.execute("DELETE FROM activities WHERE activity_id = %s", (activity_id,))
            
            connection.commit()
            
            cursor.close()
            connection.close()
            
            return True
            
        except Exception as e:
            print(f"Error deleting activity: {e}")
            return False
