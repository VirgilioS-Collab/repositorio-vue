"""
Blueprint para las rutas relacionadas con actividades en una aplicación Flask.
Este módulo define las rutas para gestionar actividades, incluyendo visualización, creación, actualización y eliminación de actividades.
"""
from flask import Blueprint
from controllers.activity_controller import (
    get_all_activities, 
    get_activity_by_id, 
    get_activities_by_group, 
    get_activities_by_club_admin,
    create_activity, 
    delete_activity,
    update_activity_details
)

# Crear blueprint
activity_bp = Blueprint("activity_bp", __name__)

# Rutas públicas para estudiantes
activity_bp.route("/api/activities", methods=['GET'])(get_all_activities)
activity_bp.route("/api/activities/<int:activity_id>", methods=['GET'])(get_activity_by_id)
activity_bp.route("/api/groups/<int:group_id>/activities", methods=['GET'])(get_activities_by_group)
# Rutas para administradores
activity_bp.route("/api/admin/clubs/<int:club_id>/activities", methods=['GET'])(get_activities_by_club_admin)
activity_bp.route("/api/admin/clubs/<int:club_id>/activities", methods=['POST'])(create_activity)
activity_bp.route("/api/admin/activities/<int:activity_id>", methods=['DELETE'])(delete_activity)
activity_bp.route("/api/admin/activities/<int:activity_id>", methods=['PUT'])(update_activity_details)