"""Blueprint  para las rutas de autenticación en una aplicación Flask.
Este módulo define las rutas para la autenticación de usuarios, incluyendo inicio de sesión, registro, etc."""

from flask import Blueprint
from controllers.auth_controller import login_user, create_user, user_refresh_token, user_forgot_password 
from controllers.auth_controller import verify_pass_reset_code,reset_password_via_code, logout, get_user_information
#Nombre del blueprint
auth_bp = Blueprint("auth_bp", __name__)

#BluePrint Autenticacion
auth_bp.route("/api/auth/login", methods=['POST'])(login_user)
auth_bp.route("/api/auth/enroll", methods=['POST'])(create_user)
auth_bp.route("/api/auth/refresh", methods=['POST'])(user_refresh_token)
auth_bp.route("/api/auth/forgot-password", methods=['POST'])(user_forgot_password)
auth_bp.route("/api/auth/verifyPassResetCode", methods=['POST'])(verify_pass_reset_code)
auth_bp.route("/api/auth/submitPasswordReset", methods=['POST'])(reset_password_via_code)
auth_bp.route("/api/auth/logout", methods=['POST'])(logout)
auth_bp.route("/api/auth/me", methods=['GET'])(get_user_information)