from flask_mail import Mail

mail = Mail()

def init_mail(app):
    """Inicializa Flask-Mail con la app ya configurada desde app.py"""
    mail.init_app(app)