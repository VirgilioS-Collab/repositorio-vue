'''
Archivo para configurar un listener a la base de datos para que actue como webhook
'''
import psycopg2
import os
import json
import select
from utils.db import get_connection
from controllers.notifications_controller import ProcessNotifications

def start_listener():
    try:
        conn = get_connection()
        conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        channel = 'database_events'
        cursor.execute(f"LISTEN {channel};")
        print(f"Escuchando canal: '{channel}'")
        while True:
            if select.select([conn], [], [], 5) == ([], [], []):
                continue
            conn.poll()
            while conn.notifies:
                notify = conn.notifies.pop(0)
                try:
                    data = json.loads(notify.payload)
                    context = data.get('event')
                    ProcessNotifications(context, data).run()
                except Exception as e:
                    print(f"Error procesando notificación: {e}")
    except Exception as e:
        print(f"Error al iniciar listener: {e}")
    