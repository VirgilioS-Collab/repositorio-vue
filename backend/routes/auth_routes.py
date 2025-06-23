from flask import Blueprint
from controllers.auth_controller import login_user, create_user, user_refresh_token, user_forgot_password, verify_pass_reset_code,reset_password_via_code
#Nombre del blueprint
auth_bp = Blueprint("auth_bp", __name__)

#BluePrint Autenticacion
auth_bp.route("/api/auth/login", methods=['POST'])(login_user)
auth_bp.route("/api/auth/userEnroll", methods=['POST'])(create_user)
auth_bp.route("/api/auth/refresh", methods=['POST'])(user_refresh_token)
auth_bp.route("/api/auth/forgot-password", methods=['POST'])(user_forgot_password)
auth_bp.route("/api/auth/verifyPassResetCode", methods=['POST'])(verify_pass_reset_code)
auth_bp.route("/api/auth/submitPasswordReset", methods=['POST'])(reset_password_via_code)