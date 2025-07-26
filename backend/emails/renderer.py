"""
Módulo de renderizado de correos electrónicos.
Este módulo provee la funcionalidad para renderizar plantillas de correos electrónicos utilizando Flask."""

from flask import render_template

class EmailRenderer:
    TEMPLATE_FOLDER = "mail_templates"

    @classmethod
    def render(cls, template_name: str, context: dict) -> str:
        """Renderiza una plantilla de correo electrónico con el contexto proporcionado.
        Args:
            template_name (str): Nombre de la plantilla a renderizar.
            context (dict): Contexto con el que se renderiza la plantilla.
        Returns:
            str: Contenido HTML renderizado de la plantilla.
        """
        file_to_render = f"{cls.TEMPLATE_FOLDER}/{template_name}"
        return render_template(file_to_render, **context)
