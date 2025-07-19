from flask import Blueprint
from controllers.user_utilities_controller import (change_password, 
                                                   upload_user_pfp, 
                                                   update_user_information, get_user_notifications, 
                                                   update_user_notifications, get_activities_by_user,
                                                   join_activity, leave_activity, upcoming_user_events)

users_bp = Blueprint("users_bp", __name__)

#BluePrint user utilities
users_bp.route("/api/users/me/change-password",methods=['POST'])(change_password)
users_bp.route('/api/users/me/photo', methods=['PUT'])(upload_user_pfp)
users_bp.route('/api/users/me', methods=['PUT'])(update_user_information)
users_bp.route('/api/users/me/notifications', methods=['GET'])(get_user_notifications)
users_bp.route('/api/users/me/notifications', methods=['PUT'])(update_user_notifications)
users_bp.route("/api/user/me/activities", methods=['GET'])(get_activities_by_user)
users_bp.route("/api/user/me/activity/<int:activity_id>", methods=['POST'])(join_activity)
users_bp.route("/api/user/me/activity/<int:activity_id>", methods=['PUT'])(leave_activity)
users_bp.route("/api/user/me/events", methods=['GET'])(upcoming_user_events)
