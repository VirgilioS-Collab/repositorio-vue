'''
Este módulo se encarga de escuchar eventos en la base de datos y procesar notificaciones.
Utiliza psycopg2 para conectarse a la base de datos y escuchar eventos en un canal específico.
Cuando se recibe una notificación, se procesa el evento y se ejecuta la lógica correspondiente.
'''
import psycopg2
import os
import json
import select
from utils.db import get_connection
from controllers.notifications_controller import ProcessNotifications

def start_listener():
    """
    Inicia el listener para escuchar eventos en la base de datos.
    Este método se conecta a la base de datos y escucha notificaciones en un canal específico.
    Cuando se recibe una notificación, se procesa el evento y se ejecuta la lógica correspondiente
    """
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
                    print(data)
                    context = data.get('event')
                    ProcessNotifications(context, data).run()
                except Exception as e:
                    print(f"Error procesando notificación: {e}")
    except Exception as e:
        print(f"Error al iniciar listener: {e}")
    