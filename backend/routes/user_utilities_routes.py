from flask import Blueprint
from controllers.user_utilities_controller import change_password, upload_user_pfp, update_user_information, get_user_notifications

users_bp = Blueprint("users_bp", __name__)

#BluePrint user utilities
users_bp.route("/api/users/me/change-password",methods=['POST'])(change_password)
users_bp.route('/api/users/me/change-profile-picture', methods=['POST'])(upload_user_pfp)
users_bp.route('/api/users/me', methods=['PUT'])(update_user_information)
users_bp.route('/api/users/me/notifications', methods=['GET'])(get_user_notifications)
#users_bp.route('/api/users/me/notifications', methods=['PUT'])(update_user_notifications)