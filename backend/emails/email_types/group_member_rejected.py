"""Módulo de correo electrónico para enviar notificaciones de rechazo de miembros de grupo.
Este módulo provee la funcionalidad para enviar un correo cuando un miembro es rechazado en un grupo.
Utiliza un renderizador para crear el contenido del correo y un remitente para enviar el correo"""
from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_group_rejection_email(recipient: str, fullname: str, group_name: str, subject="Tu solicitud no ha sido aprobada") -> bool:
    """Envía un correo electrónico notificando el rechazo de un miembro en un grupo."""
    try:
        context = {
            "fullname": fullname,
            "group_name": group_name,
            "ERROR": em.ERROR,      
            "RETRY": em.RETRY       
        }
        html = er.render("group_member_rejected.html", context)
        subject = f"{em.ERROR} {subject}"
        EmailSender(subject, [recipient]).send_html(html)
        return True
    except Exception as e:
        return False
