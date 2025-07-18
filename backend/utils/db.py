import psycopg2
import os 
from dotenv import load_dotenv

load_dotenv()

#Se carga la conexion a la base de datos
def get_connection():
    conn = {
            'host': os.getenv('DB_HOST'),
            'dbname': os.getenv('DB_NAME'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'host':os.getenv('DB_HOST'),
            'port':os.getenv('DB_PORT')}
    return psycopg2.connect(**conn)

import json

def null_parse(value):
    """
    Convierte valores 'nulos' representados como texto, JSON vacíos, listas o dicts vacíos a None de Python
    """
    if value is None:
        return None

    # Si es lista o dict vacíos, también retorna None
    if isinstance(value, (list, dict)) and len(value) == 0:
        print('si')
        return None

    if isinstance(value, str):
        v = value.strip().lower()
        if v in ('null', 'none', ''):
            return None
        try:
            parsed = json.loads(value)
            if parsed == {} or parsed == []:
                return None
        except Exception:
            pass

    return value


