"""
Club Routes
Define las rutas para los clubs/grupos
"""
from flask import Blueprint
from controllers.club_controller import (
    get_club_details,
    update_club_settings,
    get_club_by_user,
    get_member_stats,
    get_weekly_activity_heatmap,
    get_activity_enrollment_stats,
    get_club_members,
    request_join_group,
    club_pending_approval_request,
    update_pending_join_request,
    create_club,
    upload_group_pfp,
    export_club_members
)

# Crear blueprint
club_bp = Blueprint("club_bp", __name__)

# Rutas para clubs/grupos
club_bp.route("/api/groups/<int:club_id>", methods=['GET'])(get_club_details)
club_bp.route("/api/users/me/groups", methods=['GET'])(get_club_by_user)
club_bp.route("/api/groups/<int:club_id>/join", methods=['POST'])(request_join_group)
club_bp.route("/api/groups", methods= ['POST'])(create_club)
club_bp.route("/api/groups/<int:club_id>/photo", methods=['PUT'])(upload_group_pfp)
#Administración
club_bp.route("/api/admin/clubs/<int:club_id>/members/stats", methods=['GET'])(get_member_stats)
club_bp.route("/api/admin/clubs/<int:club_id>/activities/weekly-heatmap", methods=['GET'])(get_weekly_activity_heatmap)
club_bp.route("/api/admin/clubs/<int:club_id>/activities/enrollments", methods=['GET'])(get_activity_enrollment_stats)
club_bp.route("/api/admin/clubs/<int:club_id>/members/list", methods=['GET'])(get_club_members)
club_bp.route("/api/admin/clubs/<int:club_id>/settings", methods=['PUT'])(update_club_settings)
club_bp.route("/api/admin/clubs/<int:club_id>/join-requests", methods=['GET'])(club_pending_approval_request)
club_bp.route("/api/admin/clubs/<int:club_id>/join-requests/<request_id>", methods=['PUT'])(update_pending_join_request)
club_bp.route('/api/admin/clubs/<int:club_id>/members/export', methods=['GET'])(export_club_members)
