from flask import Blueprint
from controllers.auth_controller import login_user, create_user, user_refresh_token

#Nombre del blueprint
auth_bp = Blueprint("auth_bp", __name__)

#BluePrint Autenticacion
auth_bp.route("/api/auth/login", methods=['POST'])(login_user)
auth_bp.route("/api/auth/userEnroll", methods=['POST'])(create_user)
auth_bp.route("/api/auth/refresh", methods=['POST'])(user_refresh_token)