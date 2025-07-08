from flask import Blueprint
from controllers.image_controller import upload_image

image_routes = Blueprint('image_routes', __name__)

image_routes.add_url_rule('/images/upload', view_func=upload_image, methods=['POST'])
