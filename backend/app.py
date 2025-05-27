#Codigo de ejemplo de llamado con apis a la base de datos

from flask import Flask, jsonify, request
import os
import bcrypt
import psycopg2
from psycopg2 import OperationalError
from dotenv import load_dotenv

class BackendApp():
    def __init__(self):
        self.app = Flask(__name__)
        self.setup_routes()
        #Cargar las variables del env
        load_dotenv()
        self.__DB_CONFIG = {
            'host': os.getenv('DB_HOST'),
            'dbname': os.getenv('DB_NAME'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'host':os.getenv('DB_HOST'),
            'port':os.getenv('DB_PORT')
        }
        self.conn = self.get_db_connection()
        
    # Ruta de ejemplo
    def hello(self):
        if self.conn:
            return jsonify({'message': 'Conexion exitosa a la bd'}), 200
        else:
            return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500 

    def get_db_connection(self):
        try:
            conn = psycopg2.connect(**self.__DB_CONFIG)
            return conn
        except OperationalError as e:
            print(f"Error de conexión: {e}")
            return None

    def setup_routes(self):
        self.app.add_url_rule('/', 'hello', self.hello)
        self.app.add_url_rule('/login', 'user_login', self.user_login, methods=['POST'])
        self.app.add_url_rule('/signup', 'create_user', self.create_user, methods=['POST'])
        self.app.add_url_rule('/group/members', 'display_group_members', self.get_group_members, methods=['GET'])

    def user_login(self):
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No se proporcionaron datos'}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'success': False, 'message': 'Faltan credenciales'}), 400
        
        try:  
            cursor = self.conn.cursor()
            cursor.callproc('public.user_login', (username, email))
            result = cursor.fetchone()

            if not result:
                return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

            stored_password = result[8]  

            if bcrypt.checkpw(password.encode(), stored_password.encode()):
                response = {
                    'user_id': result[0],
                    'username': result[1],
                    'email': result[2],
                    'name': result[3],
                    'last_name': result[4],
                    'profile_photo_url': result[5],
                    'user_type': result[6],
                    'user_status': result[7],
                    'success': True,
                    'message': 'Login exitoso'
                }
                return jsonify(response), 200
            else:
                return jsonify({'success': False, 'message': result[7]}), 401

        except Exception as e:
            self.conn.rollback()
            return jsonify({'success': False, 'message': f"Error en el servidor: {str(e)}"}), 500
        finally:
            if cursor:
                cursor.close()

    def create_user(self):
        data = request.get_json()
        password = data['password']

        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

        required_fields = ['name', 'last_name', 'username', 'email', 'password']
        if not data:
            return jsonify({'success': False, 'message': 'No se proporcionaron datos'}), 400
        
        if not all(field in data for field in required_fields):
            return jsonify({"success": False, "message": "Faltan campos obligatorios"}), 400
        
        try:
            cursor = self.conn.cursor()
            
            cursor.execute(
            """
            CALL public.sp_create_user(
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            """,
            (
                data["name"],
                data["last_name"],
                data["username"],
                data["email"],
                data.get("phone"),
                data.get("about_me"),
                hashed_password,
                data.get("profile_photo_url"),
                data.get("user_type_id"),
                data.get("user_status_id")
            ))
            self.conn.commit()
            result = cursor.fetchone()
        
            if result and result[4]:
                return jsonify({
                    "username": result[0],   
                    "email": result[1],      
                    "message": result[2],    
                    "success": result[3],    
                    "user_id": result[4]     
                }), 201
            else:
                return jsonify({
                    "success": False,
                    "message": result[2] if result else "Error desconocido al crear usuario"
                }), 400
                
        except Exception as e:
            self.conn.rollback()
            return jsonify({'success': False, 'message': f"Error en la creacion del usuario: {str(e)}"}), 500
        finally:
            if cursor:
                cursor.close()
    
    def get_group_members(self):
        data = request.get_json()
        group_id = data['group_id']

        if not group_id:
            return jsonify({
                'success':False,
                'message': 'El parametro group_id es requerido'
            }),400
        try:
            with self.conn.cursor() as cursor:
                    cursor.callproc('public.vw_group_members', (group_id))
                    
                    members = []
                    result = cursor.fetchall()
                    
                    for member in result:
                        members.append({
                            'full_name': member[0],  
                            'status': member[1],     
                            'role': member[2],      
                            'last_seen': member[3].isoformat() if member[3] else None
                        })
                    
                    return jsonify({
                        'success': True,
                        'group_id': group_id,
                        'members': members,
                        'count': len(members)
                    }), 200
        except Exception as e:
            print(f"Error obteniendo miembros: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'Error al obtener miembros del grupo',
                'error': str(e)
            }), 500

        
    def run(self):
        self.app.run(debug=True)

if __name__ == '__main__':
    app_instance = BackendApp()
    app_instance.run()
