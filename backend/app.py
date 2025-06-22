import os
from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.user_utilities_routes import users_bp
from utils.mail import init_mail
from dotenv import load_dotenv

#Configuracion del flask
app = Flask(__name__)
init_mail(app)

load_dotenv()
frontend_origin = os.getenv('FRONTEND_ORIGIN')
CORS(app, resources={r"/api/*": {'origins': frontend_origin}}, supports_credentials=True)

app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
#app.register_blueprint(group_bp)

if __name__ == "__main__":
    app.run(debug=True)
