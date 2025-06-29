"""
Finance Routes
Define las rutas para las finanzas de un club
"""
from flask import Blueprint
from controllers.finance_controller import (
    get_finance_summary,
    get_club_transactions,
    add_transaction
)

# Crear blueprint
finance_bp = Blueprint("finance_bp", __name__)

# Rutas para finanzas
finance_bp.route("/api/admin/clubs/<int:club_id>/finances/summary", methods=['GET'])(get_finance_summary)
finance_bp.route("/api/admin/clubs/<int:club_id>/finances/transactions", methods=['GET'])(get_club_transactions)
finance_bp.route("/api/admin/clubs/<int:club_id>/finances/transactions", methods=['POST'])(add_transaction)
