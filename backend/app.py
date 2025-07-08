from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.user_utilities_routes import users_bp
from emails.mail import init_mail
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Configuración del Flask
app = Flask(__name__)

# Configuración de las cookies globales
app.config['SESSION_COOKIE_HTTPONLY'] = os.getenv("SESSION_COOKIE_HTTPONLY")
app.config['SESSION_COOKIE_SECURE'] = os.getenv("SESSION_COOKIE_SECURE")
app.config['SESSION_COOKIE_SAMESITE'] = os.getenv("SESSION_COOKIE_SAMESITE")

# Configura el mail usando variables de entorno
app.config['MAIL_SERVER'] = os.getenv("MAIL_SERVER", "localhost")
app.config['MAIL_PORT'] = int(os.getenv("MAIL_PORT", 587))
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_USE_TLS'] = os.getenv("MAIL_USE_TLS", "true").lower() == "true"
app.config['MAIL_USE_SSL'] = os.getenv("MAIL_USE_SSL", "false").lower() == "true"
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_DEFAULT_SENDER", "no-reply@localhost")

# Inicialización de flask mail
init_mail(app)

# CORS: Permitir solicitudes desde el origen del frontend
frontend_origin = os.getenv('FRONTEND_ORIGIN', 'http://localhost:5173') # Valor por defecto si no está en .env
CORS(app, resources={r"/*": {'origins': frontend_origin}}, supports_credentials=True)

# BluePrints
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
app.register_blueprint(image_routes, url_prefix='/api')
# app.register_blueprint(group_bp)

# --- Rutas Placeholder para Clubes y Actividades (para evitar 404 en el frontend) ---
# Estas rutas son temporales y deben ser reemplazadas por la lógica real del backend.

@app.route('/api/clubs/<int:club_id>', methods=['GET'])
def get_club_details(club_id):
    # Placeholder para obtener detalles de un club
    return jsonify({
        "club_id": club_id,
        "g_group_name": f"Club de Prueba {club_id}",
        "g_group_description": "Este es un club de prueba generado por el backend.",
        "g_group_category": "academic",
        "g_group_status": "active",
        "image_url": "https://via.placeholder.com/150",
        "has_funds": True if club_id % 2 == 0 else False, # Ejemplo: clubs pares tienen fondos
        "contact_info": {"email": "info@testclub.com"}
    })

@app.route('/admin/clubs/<int:club_id>/members/stats', methods=['GET'])
def get_member_stats(club_id):
    # Placeholder para estadísticas de miembros
    return jsonify({"active": 15, "inactive": 5})

@app.route('/api/clubs/<int:club_id>/weekly-activity-heatmap', methods=['GET'])
def get_weekly_activity_heatmap(club_id):
    # Placeholder para heatmap de actividades
    return jsonify([
        {"day_of_week": 0, "hour_of_day": 8, "activity_count": 5},
        {"day_of_week": 1, "hour_of_day": 10, "activity_count": 8},
        {"day_of_week": 2, "hour_of_day": 14, "activity_count": 3},
    ])

@app.route('/admin/clubs/<int:club_id>/finances/summary', methods=['GET'])
def get_finances_summary(club_id):
    # Placeholder para resumen financiero
    return jsonify({"income": 1200.50, "balance": 850.25})

@app.route('/api/activities/<int:activity_id>', methods=['GET'])
def get_activity_details(activity_id):
    # Placeholder para obtener detalles de una actividad específica
    return jsonify({
        "activity_id": activity_id,
        "ga_activity_name": f"Actividad de Prueba {activity_id}",
        "ga_activity_description": "Descripción de la actividad de prueba.",
        "ga_activity_type": "Taller",
        "ga_activity_status": "Programada",
        "ga_group_id": 1,
        "ga_creator_id": 1,
        "ga_max_capacity": 50,
        "ga_current_participants": 20,
        "club_name": "Club de Prueba 1",
        "schedules": [{"start_date": "2025-07-20T10:00:00Z", "end_date": "2025-07-20T12:00:00Z"}]
    })

@app.route('/api/activities', methods=['GET'])
def get_all_activities():
    # Placeholder para todas las actividades
    return jsonify([
        {
            "activity_id": 101,
            "ga_activity_name": "Taller de Python",
            "ga_activity_description": "Introducción a Python para principiantes.",
            "ga_activity_type": "Taller",
            "ga_activity_status": "Programada",
            "ga_group_id": 1,
            "ga_creator_id": 1,
            "ga_max_capacity": 30,
            "ga_current_participants": 15,
            "club_name": "Club de Prueba 1",
            "schedules": [{"start_date": "2025-07-15T10:00:00Z", "end_date": "2025-07-15T12:00:00Z"}]
        },
        {
            "activity_id": 102,
            "ga_activity_name": "Reunión Semanal",
            "ga_activity_description": "Discusión de proyectos actuales.",
            "ga_activity_type": "Reunión",
            "ga_activity_status": "Programada",
            "ga_group_id": 1,
            "ga_creator_id": 1,
            "ga_max_capacity": 10,
            "ga_current_participants": 8,
            "club_name": "Club de Prueba 1",
            "schedules": [{"start_date": "2025-07-16T15:00:00Z", "end_date": "2025-07-16T16:00:00Z"}]
        }
    ])

@app.route('/api/clubs/<int:club_id>/activity-enrollment-stats', methods=['GET'])
def get_activity_enrollment_stats(club_id):
    # Placeholder para estadísticas de inscripción de actividades
    return jsonify([
        {"date": "2025-07-01", "enrollments": 5},
        {"date": "2025-07-02", "enrollments": 12},
        {"date": "2025-07-03", "enrollments": 8},
    ])

@app.route('/admin/clubs/<int:club_id>/members', methods=['GET'])
def get_club_members(club_id):
    # Placeholder para miembros del club
    return jsonify([
        {"user_id": 1, "username": "user1", "name": "Juan", "last_name": "Perez", "role": "member", "status": "active"},
        {"user_id": 2, "username": "user2", "name": "Maria", "last_name": "Gomez", "role": "admin", "status": "active"},
    ])

@app.route('/api/clubs', methods=['GET'])
def get_all_clubs():
    # Placeholder para obtener todos los clubes
    return jsonify([
        {
            "club_id": 1,
            "g_group_name": "Club de Lectura",
            "g_group_description": "Amantes de la literatura.",
            "g_group_category": "academic",
            "g_group_status": "active",
            "image_url": "https://via.placeholder.com/150",
            "max_members": 50,
            "current_members": 25,
            "leader_name": "Juan Pérez"
        },
        {
            "club_id": 2,
            "g_group_name": "Club de Ajedrez",
            "g_group_description": "Estrategia y diversión.",
            "g_group_category": "social",
            "g_group_status": "active",
            "image_url": "https://via.placeholder.com/150",
            "max_members": 30,
            "current_members": 10,
            "leader_name": "María García"
        }
    ])

@app.route('/api/clubs', methods=['POST'])
def create_club():
    # Placeholder para crear un club
    data = request.get_json()
    new_club_id = 999 # ID de ejemplo
    return jsonify({"club_id": new_club_id, **data}), 201

@app.route('/admin/clubs/<int:club_id>/members/export', methods=['GET'])
def export_members_csv(club_id):
    # Placeholder para exportar miembros a CSV
    csv_data = "user_id,username,name,last_name,role,status\n1,testuser,Test,User,member,active\n2,adminuser,Admin,User,admin,active"
    response = make_response(csv_data)
    response.headers["Content-Disposition"] = "attachment; filename=members.csv"
    response.headers["Content-type"] = "text/csv"
    return response

if __name__ == "__main__":

    app.run(debug=True, port=3000)
