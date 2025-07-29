from emails.email_types.activity_cancelled import send_activity_cancel_email
from emails.email_types.activity_reminder import send_activity_reminder_email
from emails.email_types.activity_created import send_activity_created_email
from emails.email_types.verification_code_email import send_verification_email
from app import app
from flask import current_app

class ProcessNotifications:
    """ Clase para procesar notificaciones basadas en el contexto y los datos proporcionados.
     Permite manejar diferentes tipos de notificaciones.
     Se utiliza para enviar correos electrónicos relacionados con actividades, como cancelaciones, recordatorios y creaciones de actividades.
     Esta clase se integra con el sistema de notificaciones del backend y se ejecuta dentro del contexto de la aplicación Flask."""
    def __init__(self, context:str, data:str):
        """
        Inicializa la clase con el contexto y los datos necesarios para el procesamiento de notificaciones.
        Args:
            context (str): Contexto de la notificación, que determina el tipo de procesamiento a realizar.
            data (str): Datos necesarios para el procesamiento de la notificación, como información de la actividad y usuarios relacionados.
        """
        self.context = context
        self.data = data

    def run(self):
        """ Ejecuta el procesamiento de la notificación según el contexto.
        Dependiendo del contexto, se envían correos electrónicos específicos a los usuarios relacionados con la actividad.
        Si el contexto no es reconocido, se imprime un mensaje de error."""
        with app.app_context():
            match self.context:
                case 'activity_cancelled':
                    self._handle_activity_cancelled()
                case 'activity_created':
                    self._handle_activity_created()
                case 'activity_reminder':
                    self._handle_activity_reminder()
                case 'reset_pass_code':
                    self._handle_reset_pass_code()
                case _:
                    print(f"Contexto desconocido: {self.context}")

    def _handle_activity_cancelled(self):
        """ Maneja el envío de correos electrónicos para actividades canceladas.
        Extrae los datos necesarios del contexto y envía correos electrónicos a los usuarios afectados."""
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
        """ Maneja el envío de correos electrónicos de recordatorio para actividades.
        Extrae los datos necesarios del contexto y envía correos electrónicos a los usuarios relacionados con la actividad."""
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
    
    def _handle_activity_created(self):
        """ Maneja el envío de correos electrónicos para actividades creadas.
        Extrae los datos necesarios del contexto y envía correos electrónicos a los usuarios relacionados con la actividad."""
        group_name = self.data.get('group_name')
        activity_name = self.data.get('activity_name')
        user_data = self.data.get('user_data')
        for user in user_data:
            email = user.get('email')
            fullname = user.get('name')
            if email and fullname:
                send_activity_created_email(
                    recipient=email,
                    fullname=fullname,
                    activity_name=activity_name,
                    group_name=group_name
                )
    
    def _handle_reset_pass_code(self):
        """ Maneja el envío de correos electrónicos para el restablecimiento de contraseña.
        Extrae los datos necesarios del contexto y envía un correo electrónico con el código de verificación."""
        email = self.data.get('email')
        code = self.data.get('code')
        if email and code:
            send_verification_email(email, code)

    