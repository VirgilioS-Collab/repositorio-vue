from flask_mail import Message
from flask import current_app
from emails.mail import mail

class EmailSender():
    def __init__(self, subject, recipients:list):
       self._subject = subject
       self._recipients = recipients

    def send_html(self, html_content:str):
        msg = Message(
            subject=self._subject,
            recipients=self._recipients,
            html=html_content,
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)