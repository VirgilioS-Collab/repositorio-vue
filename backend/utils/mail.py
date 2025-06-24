import os
from dotenv import load_dotenv
from flask_mail import Mail, Message
from .emojis import emojis as em

mail = Mail()
load_dotenv()

def init_mail(app):
    """Inicializa Flask-Mail"""
    app.config['MAIL_SERVER'] = os.getenv("MAIL_SERVER", "localhost")
    app.config['MAIL_PORT'] = int(os.getenv("MAIL_PORT", 587))
    app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
    app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
    app.config['MAIL_USE_TLS'] = os.getenv("MAIL_USE_TLS", "true").lower() == "true"
    app.config['MAIL_USE_SSL'] = os.getenv("MAIL_USE_SSL", "false").lower() == "true"
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_DEFAULT_SENDER", "no-reply@localhost")
    mail.init_app(app)

def send_welcome_email(recipient: str, subject: str, user_name: str):
    try:
        html_body = f"""
        <html>
          <body style="font-family: 'Segoe UI', sans-serif; background-color: #f9fafb; padding: 40px;">
            <div style="
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                text-align: center;
              ">

              <img src="https://i.imgur.com/taCG40B.png" alt="Alianza UTP Logo" width="150" style="margin-bottom: 20px;">

              <h1 style="font-size: 26px; color: #1f2937; margin-bottom: 10px;">
                {em.WELCOME} ¡Bienvenido a Alianza UTP, {user_name}!
              </h1>

              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
                Estamos encantados de tenerte con nosotros. A partir de ahora, formas parte de una comunidad que apuesta por el crecimiento, el aprendizaje y la colaboración.
              </p>

              <div style="background-color: #e0f2fe; padding: 20px; border-radius: 10px; color: #0369a1; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 16px;">
                  {em.MAGNIFY} Puedes explorar tu perfil, unirte a grupos, gestionar actividades y mucho más desde nuestra plataforma.
                </p>
              </div>

              <a href="https://alianzautp.online" style="
                  display: inline-block;
                  background-color: #1e3a8a;
                  color: white;
                  padding: 12px 24px;
                  border-radius: 8px;
                  text-decoration: none;
                  font-size: 16px;
                  box-shadow: 0 4px 14px rgba(30, 58, 138, 0.4);
                ">
                Ir a la plataforma
              </a>

              <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;" />

              <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
              </p>
            </div>
          </body>
        </html>
        """
        subject = f'{em.CONFETTI} {subject}'
        msg = Message(subject=subject,
                      recipients=[recipient],
                      html=html_body)
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error al enviar correo de bienvenida: {e}")
        return False

def send_email_code(recipient: str, subject: str, code: str) -> bool:
    """Envía un correo con código de verificación usando Flask-Mail."""
    try:
        html_body = f"""
        <html>
          <body style="font-family: 'Segoe UI', sans-serif; background-color: #f9fafb; padding: 40px;">
            <div style="
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                text-align: center;
              ">
              
              <img src="https://i.imgur.com/taCG40B.png" alt="Alianza UTP Logo" width="150" style="margin-bottom: 20px;">

              <h1 style="font-size: 24px; color: #1f2937; margin-bottom: 20px;">
                {em.LOCK} Recuperación de contraseña
              </h1>

              <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
                Si no fuiste tú, puedes ignorar este mensaje con seguridad.
              </p>

              <p style="font-size: 16px; color: #1f2937; margin-top: 30px;">
                Aquí tienes tu código de verificación:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <span style="
                    display: inline-block;
                    padding: 14px 28px;
                    background-color: #1e3a8a; /* bg-primary-dark */
                    color: #ffffff;
                    font-size: 26px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    border-radius: 8px;
                    box-shadow: 0 4px 14px rgba(30, 58, 138, 0.4);
                  ">
                  {code}
                </span>
              </div>

              <p style="font-size: 14px; color: #6b7280;">
                Este código expirará en <strong>10 minutos</strong>.
              </p>

              <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;" />

              <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                Gracias por confiar en nosotros. Si tienes alguna duda, contáctanos.
              </p>
            </div>
          </body>
        </html>
        """
        msg = Message(subject=subject,
                      recipients=[recipient],
                      html=html_body)
        mail.send(msg)
        return True

    except Exception as e:
        print(f"Error al enviar correo a {recipient}: {e}")
        return False
    