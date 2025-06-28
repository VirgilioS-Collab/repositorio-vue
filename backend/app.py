import os
from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.user_utilities_routes import users_bp
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
frontend_origin = os.getenv('FRONTEND_ORIGIN')
CORS(app, resources={r"/api/*": {'origins': frontend_origin}}, supports_credentials=True)

#BluePrints
app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
#app.register_blueprint(group_bp)

if __name__ == "__main__":
    app.run(debug=True, port=3000)
