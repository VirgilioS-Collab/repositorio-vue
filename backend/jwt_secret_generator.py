import os
import secrets

# Genera una clave segura de 32 bytes, esta clave debe ir ubicada en el .env
secret_key = secrets.token_urlsafe(32)
print(secret_key)