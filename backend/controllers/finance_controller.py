"""
Finance Controller
Maneja las peticiones HTTP para las finanzas de un club
"""
from flask import request, jsonify
from services.finance_service import FinanceService
from services.jwt_service import JWTService as jwts

def get_finance_summary(club_id):
    """
    GET /api/admin/clubs/{club_id}/finances/summary
    Obtiene el resumen financiero de un club
    Requiere autenticación
    """
    try:
        # Verificar token de autenticación
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token de acceso requerido'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwts.decode_token(token)
        
        if not payload:
            return jsonify({'error': 'Token inválido'}), 401
        
        # Aquí podrías verificar permisos de administración del club
        # user_id = payload.get('user_id')
        
        summary = FinanceService.get_finance_summary(club_id)
        if summary is None:
            return jsonify({'error': 'Error al obtener el resumen financiero'}), 500
        
        return jsonify(summary), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

def get_club_transactions(club_id):
    """
    GET /api/admin/clubs/{club_id}/finances/transactions
    Obtiene todas las transacciones de un club
    Requiere autenticación
    """
    try:
        # Verificar token de autenticación
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token de acceso requerido'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwts.decode_token(token)
        
        if not payload:
            return jsonify({'error': 'Token inválido'}), 401
        
        # Aquí podrías verificar permisos de administración del club
        # user_id = payload.get('user_id')
        
        transactions = FinanceService.get_club_transactions(club_id)
        return jsonify(transactions), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

def add_transaction(club_id):
    """
    POST /api/admin/clubs/{club_id}/finances/transactions
    Registra una nueva transacción
    Requiere autenticación
    """
    try:
        # Verificar token de autenticación
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token de acceso requerido'}), 401
        
        token = auth_header.split(' ')[1]
        payload = jwts.decode_token(token)
        
        if not payload:
            return jsonify({'error': 'Token inválido'}), 401
        
        # Aquí podrías verificar permisos de administración del club
        # user_id = payload.get('user_id')
        
        # Obtener datos de la transacción
        data = request.get_json()
        
        # Validaciones básicas
        required_fields = ['date', 'description', 'category', 'type', 'amount']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Validar tipo de transacción
        if data.get('type') not in ['income', 'expense']:
            return jsonify({'error': 'El tipo debe ser "income" o "expense"'}), 400
        
        # Validar monto
        try:
            amount = float(data.get('amount'))
            if amount <= 0:
                return jsonify({'error': 'El monto debe ser mayor a 0'}), 400
            data['amount'] = amount
        except (ValueError, TypeError):
            return jsonify({'error': 'El monto debe ser un número válido'}), 400
        
        # Crear la transacción
        transaction = FinanceService.add_transaction(club_id, data)
        
        if not transaction:
            return jsonify({'error': 'Error al crear la transacción'}), 500
        
        return jsonify(transaction), 201
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500
