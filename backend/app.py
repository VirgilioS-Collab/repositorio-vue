from flask import Flask, jsonify, request
import os
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
            cursor.callproc('public.user_login', (username, email, password))
            result = cursor.fetchone()

            if result:
                response = {
                    'user_id': result[0],
                    'username': result[1],
                    'email': result[2],
                    'name': result[3],
                    'last_name': result[4],
                    'profile_photo_url': result[5],
                    'user_type': result[6],
                    'user_status': result[7],
                    'success': result[8],
                    'message': result[9]
                }

            if response['success']:
                return jsonify(response), 200
            else:
                return jsonify({'success': False, 'message': response['message']}), 401

        except Exception as e:
            self.conn.rollback()
            return jsonify({'success': False, 'message': f"Error en el servidor: {str(e)}"}), 500
        finally:
            if cursor:
                cursor.close()

    def run(self):
        self.app.run(debug=True)

if __name__ == '__main__':
    app_instance = BackendApp()
    app_instance.run()
