from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.user_utilities_routes import users_bp
from routes.activity_routes import activity_bp
from routes.club_routes import club_bp
from routes.finance_routes import finance_bp
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

if __name__ == "__main__":

    app.run(debug=True, port=3000)
