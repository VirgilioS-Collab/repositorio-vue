"""
Este archivo permite que Gunicorn inicie correctamente el worker asociado a la aplicación
"""
from app import app
app.run()