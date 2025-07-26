from flask_mail import Message
from flask import current_app
from emails.mail import mail

class EmailSender():
    """ Clase para enviar correos electrónicos.
    Esta clase se encarga de enviar correos electrónicos utilizando Flask-Mail.
    Permite configurar el asunto, los destinatarios y el contenido del correo.
    Se utiliza para enviar correos electrónicos de diferentes tipos, como bienvenida, verificación, etc"""
    def __init__(self, subject, recipients:list):
       """Inicializa la clase con el asunto y los destinatarios del correo.
       Args:
           subject (str): Asunto del correo electrónico.
           recipients (list): Lista de direcciones de correo electrónico de los destinatarios.
       """
       self._subject = subject
       self._recipients = recipients

    def send_html(self, html_content:str):
        """Envía un correo electrónico con contenido HTML.
        Args:
            html_content (str): Contenido HTML del correo electrónico.
        """
        msg = Message(
            subject=self._subject,
            recipients=self._recipients,
            html=html_content,
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)