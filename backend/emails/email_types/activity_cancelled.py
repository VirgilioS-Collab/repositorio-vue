"""Módulo de correo electrónico para enviar notificaciones de cancelación de actividades.
Este módulo provee la funcionalidad para enviar una notificación por correo cuando una actividad es cancelada.
Utiliza un renderizador para crear el contenido del correo y un remitente para enviar el correo.
"""
from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_activity_cancel_email(recipient: str, fullname: str, activity_name: str, subject="Actividad cancelada") -> bool:
    """
    Envía un correo electrónico notificando la cancelación de una actividad.
    """
    try:
        context = {
            "fullname": fullname,
            "activity_name": activity_name,
            "HAND_WAVE": em.WELCOME,
            "CANCEL": em.ERROR,
            "SORRY": em.SAD,
        }
        html = er.render("activity_cancelled.html", context)
        subject = f"{em.ERROR} {subject}"
        EmailSender(subject, [recipient]).send_html(html)
        return True
    except Exception as e:
        print(f"Error al enviar correo: {e}")
        return False