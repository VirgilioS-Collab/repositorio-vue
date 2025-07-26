"""
Este archivo inicia el servicio de listener para escuchar eventos en la base de datos.
Utiliza el módulo `listener` para establecer una conexión a la base de datos y escuchar notificaciones.
Cuando se recibe una notificación, se procesa el evento y se ejecuta la lógica correspondiente.
"""

from utils.listener import start_listener

if __name__ == "__main__":
    print("Iniciando servicio de listener...")
    start_listener()
