from emails.renderer import EmailRenderer as er
from emails.sender import EmailSender
from utils.emojis import emojis as em

def send_group_member_approval_email(recipient: str, fullname: str, group_name: str, subject="¡Tu solicitud ha sido aprobada!") -> bool:
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
