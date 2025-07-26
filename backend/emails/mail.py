""""
Módulo de correo electrónico para la configuración de Flask-Mail.
Este módulo provee la funcionalidad para inicializar Flask-Mail con la aplicación Flask.
"""

from flask_mail import Mail

mail = Mail()

def init_mail(app):
    """Inicializa Flask-Mail con la app ya configurada desde app.py"""
    mail.init_app(app)