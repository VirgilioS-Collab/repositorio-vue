from flask import render_template

class EmailRenderer:
    TEMPLATE_FOLDER = "mail_templates"

    @classmethod
    def render(cls, template_name: str, context: dict) -> str:
        file_to_render = f"{cls.TEMPLATE_FOLDER}/{template_name}"
        return render_template(file_to_render, **context)
