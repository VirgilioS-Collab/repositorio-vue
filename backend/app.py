"""

Este archivo configura la aplicación Flask, incluyendo las rutas, CORS y el correo electrónico.
Se utiliza para inicializar la aplicación y registrar los blueprints necesarios.
Se carga la configuración desde un archivo .env y se inicializa Flask-Mail.
Se configura CORS para permitir solicitudes desde el frontend.
Los blueprints registrados incluyen autenticación, utilidades de usuario, actividades y clubes.
La aplicación se ejecuta en modo de depuración en el puerto 3000.
Este archivo es el punto de entrada de la aplicación Flask."""
import os
from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.user_utilities_routes import users_bp
from routes.activity_routes import activity_bp
from routes.club_routes import club_bp
from emails.mail import init_mail
from dotenv import load_dotenv
#Cargar variables de entorno
load_dotenv()
#Configuracion del flask
app = Flask(__name__)
#Configuracion de las cookies globales
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
#Inicializacion de flask mail
init_mail(app)

#CORS
frontend_origins = os.getenv('FRONTEND_ORIGIN', '')
allowed_origins = [origin.strip() for origin in frontend_origins.split(',') if origin.strip()]
CORS(app, resources={r"/api/*": {'origins': allowed_origins}}, supports_credentials=True)

#BluePrints
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
app.register_blueprint(activity_bp)
app.register_blueprint(club_bp)

if __name__ == "__main__":
    app.run(debug=True, port=3000)