from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

# Configuración de conexión a Supabase (Transaction Pooler)
conn = psycopg2.connect(
    host='aws-0-us-east-2.pooler.supabase.com',
    user='postgres.eyjkoybrbgcidcgpivua',
    password='Vfa%5Y$u*d2UAhs',
    dbname='postgres',
    port=6543,
    sslmode='require'
)

# Obtener todos los usuarios
@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    try:
        cur = conn.cursor()
        cur.execute('SELECT * FROM users')
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        usuarios = [dict(zip(columns, row)) for row in rows]
        cur.close()
        return jsonify(usuarios)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Obtener un usuario por ID
@app.route('/api/usuarios/<int:id>', methods=['GET'])
def get_usuario(id):
    try:
        cur = conn.cursor()
        cur.execute('SELECT * FROM users WHERE user_id = %s', (id,))
        row = cur.fetchone()
        columns = [desc[0] for desc in cur.description]
        cur.close()
        if row:
            return jsonify(dict(zip(columns, row)))
        else:
            return jsonify({'mensaje': 'Usuario no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Crear un usuario usando el procedimiento almacenado
@app.route('/api/usuarios', methods=['POST'])
def create_usuario():
    data = request.json
    try:
        cur = conn.cursor()
        cur.execute(
            "CALL sp_create_user(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (
                data.get('firstName'),
                data.get('lastName'),
                data.get('username'),
                data.get('email'),
                data.get('password'),
                data.get('phone'),
                data.get('birthDate'),
                data.get('docType'),
                data.get('docNumber'),
                data.get('gender')
            )
        )
        conn.commit()
        cur.close()
        return jsonify({'mensaje': 'Usuario creado'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Actualizar un usuario
@app.route('/api/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    data = request.json
    try:
        cur = conn.cursor()
        cur.execute(
            "UPDATE users SET u_name = %s, u_last_name = %s, u_username = %s, u_email = %s, u_phone = %s WHERE user_id = %s RETURNING *",
            (
                data.get('firstName'),
                data.get('lastName'),
                data.get('username'),
                data.get('email'),
                data.get('phone'),
                id
            )
        )
        updated = cur.fetchone()
        columns = [desc[0] for desc in cur.description]
        conn.commit()
        cur.close()
        if updated:
            return jsonify(dict(zip(columns, updated)))
        else:
            return jsonify({'mensaje': 'Usuario no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Eliminar un usuario
@app.route('/api/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM users WHERE user_id = %s RETURNING *", (id,))
        deleted = cur.fetchone()
        conn.commit()
        cur.close()
        if deleted:
            return jsonify({'mensaje': 'Usuario eliminado'})
        else:
            return jsonify({'mensaje': 'Usuario no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)