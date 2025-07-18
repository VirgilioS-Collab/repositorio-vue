"""
Este archivo permite que Gunicorn inicie correctamente el worker asociado a la aplicación
"""

from app import app
from listener import start_listener
import threading

threading.Thread(target=start_listener, daemon=True).start()
