"""Módulo de correo electrónico para enviar códigos de verificación.
Este módulo provee la funcionalidad para enviar un correo con un código de verificación.
Utiliza un renderizador para crear el contenido del correo y un remitente para enviar el correo."""
from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_verification_email(recipient:str, code:str, subject= "¿Olvidaste tu contraseña? Aquí está tu código de acceso") -> bool:
    try:
        context = {
            "code": code,
            "LOCK": em.LOCK
        }
        html = er.render("verification_code.html", context)
        subject = f"{em.MAGNIFY} {subject}"
        EmailSender(subject, [recipient]).send_html(html)
        return True

    except Exception as e:
        return False