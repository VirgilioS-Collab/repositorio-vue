from flask import Blueprint, request, jsonify
from services.image_service import ImageService

image_bp = Blueprint('image_bp', __name__)

@image_bp.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No se proporcionó ninguna imagen'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No se seleccionó ningún archivo'}), 400

    try:
        image_url = ImageService.upload_image(image_file)
        return jsonify({'imageUrl': image_url}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
