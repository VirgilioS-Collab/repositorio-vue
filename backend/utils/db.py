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

def null_parse(value):
    """
    Convierte valores 'nulos' representados como texto a None de Python
    """
    if value is None:
        return None

    if isinstance(value, str):
        if value.strip().lower() in ('null', 'none', ''):
            return None

    return value
