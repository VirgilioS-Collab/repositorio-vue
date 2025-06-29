"""
Finance Service
Maneja la lógica de negocio para las finanzas de un club
"""
from utils.db import get_connection
from typing import List, Dict, Any, Optional
from datetime import datetime

class FinanceService:
    
    @staticmethod
    def get_finance_summary(club_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene el resumen financiero (ingresos, egresos, saldo) de un club
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            # Consulta para calcular ingresos
            income_query = """
            SELECT COALESCE(SUM(amount), 0) as total_income
            FROM club_transactions 
            WHERE club_id = %s AND type = 'income'
            """
            
            cursor.execute(income_query, (club_id,))
            income_result = cursor.fetchone()
            income = float(income_result[0]) if income_result[0] else 0.0
            
            # Consulta para calcular egresos
            expenses_query = """
            SELECT COALESCE(SUM(amount), 0) as total_expenses
            FROM club_transactions 
            WHERE club_id = %s AND type = 'expense'
            """
            
            cursor.execute(expenses_query, (club_id,))
            expenses_result = cursor.fetchone()
            expenses = float(expenses_result[0]) if expenses_result[0] else 0.0
            
            # Calcular balance
            balance = income - expenses
            
            result = {
                'income': income,
                'expenses': expenses,
                'balance': balance
            }
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting finance summary: {e}")
            return None
    
    @staticmethod
    def get_club_transactions(club_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene una lista de todas las transacciones de un club
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            query = """
            SELECT 
                id,
                date,
                description,
                category,
                type,
                amount
            FROM club_transactions
            WHERE club_id = %s
            ORDER BY date DESC
            """
            
            cursor.execute(query, (club_id,))
            transactions = cursor.fetchall()
            
            result = []
            for transaction in transactions:
                result.append({
                    'id': transaction[0],
                    'date': transaction[1].isoformat() if transaction[1] else None,
                    'description': transaction[2],
                    'category': transaction[3],
                    'type': transaction[4],
                    'amount': float(transaction[5]) if transaction[5] else 0.0
                })
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error getting club transactions: {e}")
            return []
    
    @staticmethod
    def add_transaction(club_id: int, transaction_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Registra una nueva transacción (ingreso o egreso)
        """
        try:
            connection = get_connection()
            cursor = connection.cursor()
            
            # Insertar la nueva transacción
            query = """
            INSERT INTO club_transactions (
                club_id,
                date,
                description,
                category,
                type,
                amount
            ) VALUES (%s, %s, %s, %s, %s, %s)
            """
            
            cursor.execute(query, (
                club_id,
                transaction_data.get('date'),
                transaction_data.get('description'),
                transaction_data.get('category'),
                transaction_data.get('type'),
                transaction_data.get('amount')
            ))
            
            # Obtener el ID de la transacción recién creada
            transaction_id = cursor.lastrowid
            connection.commit()
            
            # Obtener la transacción completa
            cursor.execute("""
                SELECT id, date, description, category, type, amount
                FROM club_transactions 
                WHERE id = %s
            """, (transaction_id,))
            
            transaction = cursor.fetchone()
            
            if transaction:
                result = {
                    'id': transaction[0],
                    'date': transaction[1].isoformat() if transaction[1] else None,
                    'description': transaction[2],
                    'category': transaction[3],
                    'type': transaction[4],
                    'amount': float(transaction[5]) if transaction[5] else 0.0
                }
            else:
                result = None
            
            cursor.close()
            connection.close()
            return result
            
        except Exception as e:
            print(f"Error adding transaction: {e}")
            return None
