import os
import requests

class ImageService:
    @staticmethod
    def upload_image(image_file):
        client_id = os.getenv('IMGUR_CLIENT_ID')
        client_secret = os.getenv('IMGUR_CLIENT_SECRET')
        imgur_endpoint = os.getenv('IMGUR_ENDPOINT')

        if not all([client_id, client_secret, imgur_endpoint]):
            raise Exception("Configuración de Imgur incompleta en las variables de entorno.")

        headers = {
            'Authorization': f'Client-ID {client_id}'
        }
        files = {
            'image': (image_file.filename, image_file.stream, image_file.content_type)
        }

        try:
            response = requests.post(imgur_endpoint, headers=headers, files=files)
            response.raise_for_status() # Lanza una excepción para códigos de estado HTTP erróneos
            data = response.json()
            if data['success']:
                return data['data']['link']
            else:
                raise Exception(f"Error al subir imagen a Imgur: {data['data']['error']}")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error de conexión con Imgur: {e}")
        except Exception as e:
            raise Exception(f"Error inesperado al procesar la respuesta de Imgur: {e}")
