"""Módulo de correo electrónico para enviar notificaciones de aprobación de miembros de grupo.
Este módulo provee la funcionalidad para enviar un correo cuando un miembro es aprobado en un grupo.
Utiliza un renderizador para crear el contenido del correo y un remitente para enviar el correo.
"""
from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_group_member_approval_email(recipient: str, fullname: str, group_name: str, subject="¡Tu solicitud ha sido aprobada!") -> bool:
    """Envía un correo electrónico notificando la aprobación de un miembro en un grupo."""
    try:
        context = {
            "fullname": fullname,
            "group_name": group_name,
            "PARTY": em.CONFETTI,
            "CHECK": em.CHECK
        }
        html = er.render("group_member_approved.html", context)
        subject = f"{em.CHECK} {subject}"
        EmailSender(subject, [recipient]).send_html(html)
        return True
    except Exception as e:
        return False
