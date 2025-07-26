"""
    Módulo de correo electrónico para enviar notificaciones de inscripción en actividades.
    Este módulo provee la funcionalidad para enviar un correo cuando un usuario se inscribe en una actividad.
    Utiliza un renderizador para crear el contenido del correo y un remitente para enviar el correo."""
from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_activity_join_email(recipient: str, data: dict) -> bool:
    """Envía un correo electrónico notificando la inscripción de un usuario en una actividad."""
    try:
        context = {
            **data,
            "HAND_WAVE": em.WELCOME,
            "CALENDAR": em.CALENDAR,
            "WELCOME": em.WELCOME,
            "PIN": em.PIN,
            "NOTES": em.NOTE,
            "TIME": em.TIME,
            "PLACE": em.LOCATION,
            "LIGHTBULB": em.LIGHTBULB
        }
        html = er.render("joined_activity.html", context)
        subject = f"{em.ANNOUNCE} Confirmación de inscripción en actividad"
        EmailSender(subject, [recipient]).send_html(html)
        return True
    except Exception as e:
        print(f"Error al enviar correo: {e}")
        return False
