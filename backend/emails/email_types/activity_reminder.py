"""Módulo de correo electrónico para enviar recordatorios de actividades.
Este módulo provee la funcionalidad para enviar un recordatorio por correo cuando una actividad está próxima a ocurrir.
Utiliza un renderizador para crear el contenido del correo y un remitente para enviar el correo.
"""
from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_activity_reminder_email(recipient: str, fullname: str, activity_name: str, activity_time: str, location: str) -> bool:
    """Envía un correo electrónico recordando a un usuario sobre una actividad próxima."""
    try:
        context = {
            "fullname": fullname,
            "activity_name": activity_name,
            "activity_time": activity_time,
            "location": location,
            "HAND_WAVE": em.WELCOME,
            "CALENDAR": em.CALENDAR,
            "TIME": em.TIME,
            "PLACE": em.LOCATION,
            "LIGHTBULB": em.LIGHTBULB
        }
        html = er.render("activity_reminder.html", context)
        subject = f"{em.TIME} Recordatorio de actividad"
        EmailSender(subject, [recipient]).send_html(html)
        return True
    except Exception as e:
        print(f"Error al enviar correo: {e}")
        return False
