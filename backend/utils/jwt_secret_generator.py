"""
Módulo para generar una clave secreta segura para JWT.
Este módulo utiliza la biblioteca secrets para generar una clave secreta de 32 bytes.
La clave generada debe ser almacenada en un archivo .env para su uso en la aplicación."""
import os
import secrets
# Genera una clave segura de 32 bytes, esta clave debe ir ubicada en el .env
secret_key = secrets.token_urlsafe(32)
print(secret_key)