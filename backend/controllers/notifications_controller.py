from emails.email_types.activity_cancelled import send_activity_cancel_email
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
 
    def _handle_activity_created(self):
        pass