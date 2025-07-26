"""Módulo de correo electrónico para enviar notificaciones de salida de actividades.
Este módulo provee la funcionalidad para enviar un correo cuando un usuario se retira de una actividad.
Utiliza un renderizador para crear el contenido del correo y un remitente para enviar el correo."""

from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_activity_left_email(recipient: str, data: dict) -> bool:
    """Envía un correo electrónico notificando la salida de un usuario de una actividad."""
    try:
        context = {
            **data,
            "WELCOME": em.WELCOME,
            "ANNOUNCE": em.ANNOUNCE,
        }
        html = er.render("left_activity.html", context)
        subject = f"{em.ANNOUNCE} Confirmación de salida de actividad"
        EmailSender(subject, [recipient]).send_html(html)
        return True
    except Exception as e:
        print(f"Error al enviar correo: {e}")
        return False

