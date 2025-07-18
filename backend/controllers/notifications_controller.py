from emails.email_types.activity_cancelled import send_activity_cancel_email
from emails.email_types.activity_reminder import send_activity_reminder_email
from app import app
from flask import current_app

class ProcessNotifications:
    def __init__(self, context:str, data:str):
        self.context = context
        self.data = data

    def run(self):
        with app.app_context():
            match self.context:
                case 'activity_cancelled':
                    self._handle_activity_cancelled()
                case 'activity_created':
                    self._handle_activity_created()
                case 'activity_reminder':
                    self._handle_activity_reminder()
                case _:
                    print(f"Contexto desconocido: {self.context}")

    def _handle_activity_cancelled(self):
        user_data = self.data.get('user_data')
        activity_name = self.data.get('activity_name')

        for user in user_data:
            try:
                email = user.get("email")
                name = user.get("name")
                send_activity_cancel_email(email, name, activity_name)
            except Exception as e:
                print("Error al enviar correo de cancelación:", e)
 
    def _handle_activity_reminder(self):
        activity_name = self.data.get('activity_name')
        location = self.data.get('location')
        activity_time = self.data.get('activity_time')
        user_data = self.data.get('user_data')
        for user in user_data:
            email = user.get('email')
            fullname = user.get('name')
            if email and fullname:
                send_activity_reminder_email(
                    recipient=email,
                    fullname=fullname,
                    activity_name=activity_name,
                    activity_time=activity_time,
                    location=location
                )