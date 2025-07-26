"""Módulo de correo electrónico para enviar notificaciones de creación de actividades.
Este módulo provee la funcionalidad para enviar una notificación por correo cuando una actividad es creada
Utiliza un renderizador para crear el contenido del correo y un remitente para enviar el correo."""
from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_activity_created_email(recipient: str, fullname: str, activity_name: str, group_name:str,subject="Nueva actividad en tu grupo") -> bool:
    """Envía un correo electrónico notificando la creación de una actividad."""
    try:
        context = {
            "fullname": fullname,
            "group_name": group_name,
            "activity_name": activity_name,
            "HAND_WAVE": em.WELCOME,
            "MEGAPHONE": em.ANNOUNCE,
            "CALENDAR": em.CALENDAR,
            "LIGHTBULB": em.LIGHTBULB,
        }
        html = er.render("activity_created.html", context)
        subject = f"{em.ANNOUNCE} {subject}"
        EmailSender(subject, [recipient]).send_html(html)
        return True
    except Exception as e:
        print(f"Error al enviar correo: {e}")
        return False