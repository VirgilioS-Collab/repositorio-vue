"""Módulo de correo electrónico para enviar correos de bienvenida.
Este módulo provee la funcionalidad para enviar un correo de bienvenida a nuevos usuarios.
Utiliza un renderizador para crear el contenido del correo y un remitente para enviar el correo.
"""
from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_welcome_email(recipient: str, user_name: str, subject="¡Bienvenido a Alianza UTP!")-> bool:
    """Envía un correo electrónico de bienvenida a un nuevo usuario."""
    try:
        context = {
            'user_name': user_name,
            'WELCOME': em.WELCOME,
            'MAGNIFY': em.MAGNIFY
        }

        html = er.render('welcome.html', context)
        subject = f'{em.CONFETTI} {subject}'
        EmailSender(subject=subject, recipients=[recipient]).send_html(html)
        return True
    except Exception as e:
        print(f'Error al enviar correo de bienvenida:{e}')
        return False