from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_welcome_email(recipient: str, user_name: str, subject="¡Bienvenido a Alianza UTP!")-> bool:
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