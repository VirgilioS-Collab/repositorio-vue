from flask import Blueprint
from controllers.auth_controller import login_user, create_user

#Nombre del blueprint
auth_bp = Blueprint("auth_bp", __name__)

auth_bp.route("/api/auth/login", methods=["POST"])(login_user)
auth_bp.route("/api/auth/userEnroll", methods=['POST'])(create_user)