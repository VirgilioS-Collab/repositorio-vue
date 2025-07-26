import requests
import os
from dotenv import load_dotenv
import io
from PIL import Image

class ImageUploader:
    '''
    Módulo que encapsula la lógica de procesamiento y subida de imágenes a Imgur mediante su API.
    '''
    def __init__(self, files:dict):
        """
        Inicializa el uploader con los archivos a procesar. 
        Args:
            files (dict): Diccionario que contiene los archivos a subir, con la clave 'image'.
        """
        self.__files = files
        load_dotenv()
        self.__headers = {'Authorization': f"Client-ID {os.getenv('IMGUR_CLIENT_ID', '')}"}
        self.__endpoint = os.getenv('IMGUR_ENDPOINT', '')
        self.__size = int(os.getenv('IMGUR_IMAGE_SQUARE_SIZE', 1024))

    
    def run(self):
        """ Ejecuta el proceso de subida de la imagen.
        Retorna un diccionario con el resultado de la operación."""
        processed_image = self.__process_image()
        if not processed_image:
            return {"success": False, "error": "No se pudo procesar la imagen"}
        
        files = {'image': ('image.jpg', processed_image, 'image/jpeg')}
        return self.__imgur_uploader(files)

    def __process_image(self):
        """ Procesa la imagen para que sea cuadrada y del tamaño adecuado.
        Retorna un objeto BytesIO con la imagen procesada."""
        try:
            img = Image.open(self.__files)
            width, height = img.size

            if width != height:
                min_dim = min(width, height)
                left = (width - min_dim) / 2
                top = (height - min_dim) / 2
                right = (width + min_dim) / 2
                bottom = (height + min_dim) / 2
                img = img.crop((left, top, right, bottom))

            img = img.resize((self.__size, self.__size), Image.Resampling.LANCZOS)
            # Convertir la imagen a RGB si tiene canal alfa
            if img.mode in ("RGBA", "LA", "P"):
                img = img.convert("RGB")

            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='JPEG')
            img_byte_arr.seek(0)
            img.close()
            return img_byte_arr
        
        except Exception as e:
            print(f"[ERROR] Procesamiento de imagen: {e}")
            return None

    def __imgur_uploader(self, files):
        """ Realiza la subida de la imagen a Imgur.
       Args:
            files (dict): Diccionario con la imagen a subir."""
        try:
            response = requests.post(self.__endpoint, headers=self.__headers, files=files)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"success": False, "error": str(e)}