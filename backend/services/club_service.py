"""
Club Service
Maneja la lógica de negocio para los clubs/grupos
"""
from utils.db import get_connection
from typing import Dict, Any, Optional
import json

class ClubService:
    
    @staticmethod
    def get_club_details(club_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene los detalles de un club/grupo específico por su ID
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            query = """
            SELECT 
                g.group_id,
                g.group_name,
                g.group_description,
                g.group_type_id,
                g.group_status_id,
                g.creator_id,
                g.creation_date,
                g.logo_url,
                g.has_funds,
                g.social_links,
                gt.group_type_name,
                gs.group_status_name,
                (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.group_id) as members_count
            FROM groups g
            LEFT JOIN group_types gt ON g.group_type_id = gt.group_type_id
            LEFT JOIN group_statuses gs ON g.group_status_id = gs.group_status_id
            WHERE g.group_id = %s
            """
            
            cursor.execute(query, (club_id,))
            club = cursor.fetchone()
            
            if not club:
                cursor.close()
                connection.close()
                return None
            
            # Parsear social_links si existe
            social_links = {}
            if club[9]:  # social_links column
                try:
                    social_links = json.loads(club[9])
                except:
                    social_links = {}
            
            result = {
                'group_id': club[0],
                'group_name': club[1],
                'group_description': club[2],
                'group_type_id': club[3],
                'group_status_id': club[4],
                'creator_id': club[5],
                'creation_date': club[6].isoformat() if club[6] else None,
                'logo_url': club[7],
                'has_funds': bool(club[8]) if club[8] is not None else False,
                'social_links': social_links,
                'group_type_name': club[10],
                'group_status_name': club[11],
                'members_count': club[12]
            }
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting club details: {e}")
            return None
    
    @staticmethod
    def update_club_settings(club_id: int, settings_data: Dict[str, Any]) -> bool:
        """
        Actualiza los ajustes generales de un club
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            # Construir query dinámicamente solo con campos proporcionados
            update_fields = []
            values = []
            
            # Campos simples
            simple_fields = ['logo_url', 'description', 'has_funds']
            for field in simple_fields:
                if field in settings_data:
                    if field == 'description':
                        update_fields.append("group_description = %s")
                    elif field == 'has_funds':
                        update_fields.append("has_funds = %s")
                    else:
                        update_fields.append(f"{field} = %s")
                    values.append(settings_data[field])
            
            # Campo social_links (JSON)
            if 'social_links' in settings_data:
                update_fields.append("social_links = %s")
                values.append(json.dumps(settings_data['social_links']))
            
            if not update_fields:
                return True  # No hay nada que actualizar
            
            values.append(club_id)
            
            query = f"UPDATE groups SET {', '.join(update_fields)} WHERE group_id = %s"
            
            cursor.execute(query, values)
            connection.commit()
            
            cursor.close()
            connection.close()
            
            return True
            
        except Exception as e:
            print(f"Error updating club settings: {e}")
            return False
