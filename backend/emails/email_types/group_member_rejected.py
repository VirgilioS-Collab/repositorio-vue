from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_group_rejection_email(recipient: str, fullname: str, group_name: str, subject="Tu solicitud no ha sido aprobada") -> bool:
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
