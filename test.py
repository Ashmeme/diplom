from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS, cross_origin
import os
import logging

from db import create_document, delete_document, get_all_documents, get_document, update_status
from utils import get_file_format, process_file

flask_app = Flask(__name__, static_url_path='',
                  static_folder='build',
                  template_folder='build')

logging.basicConfig(level=logging.INFO)

flask_app.config['CORS_HEADERS'] = 'Content-Type'
CORS(flask_app, origins=['http://20.163.179.165',"http://localhost:3000"])



@flask_app.route('/')
def serve():
    return send_from_directory(flask_app.static_folder, 'index.html')

@flask_app.route("/files")
def hello():
    return render_template("index.html")

@flask_app.route("/api/getFiles", methods =["GET"])
def getFiles():
    response = get_all_documents()
    return response, 200    


@flask_app.route("/api/deleteFile/<file_id>", methods =["DELETE"])
def deleteFile(file_id):
    doc = get_document(file_id)
    filename = file_id + get_file_format(doc["name"])
    try:
        os.remove(f"audio/{file_id}.wav")
    except Exception as e:
        return jsonify({'error': f'Couldnt delete {doc["name"]}: {e}'}), 500
    delete_document(file_id)
    return jsonify({'message': f'File {doc["name"]} deleted'}), 202
    


@flask_app.route("/api/downloadFile/<file_id>", methods =["GET"])
def downloadFile(file_id):
    return send_from_directory("audio", file_id + ".wav")



@flask_app.route("/api/uploadFile", methods =["POST"])
def upload_file():
    
    for filename, file in request.files.items():

        # Optional: Validate file extension or size
        if not filename.endswith(('.txt','.docx')):  # Example allowed extensions
            return jsonify({'error': 'Invalid file format'}), 400
        # Save the file
        try:

            file_id = create_document(filename) 
            
            file_format = get_file_format(filename)
            filename = f"{file_id}{file_format}"
            file.save(os.path.join('uploads', filename))  # Use os.path.join for safer path construction
            logging.info("starting processing")
            update_status( file_id, "Processing")
            process_file(filename, file_id)
            update_status(file_id, "Ready")
        except Exception as e:
            update_status(file_id, "Failed")
            logging.error(f"Error processing file {filename}: {e}")
            return jsonify({'error': f'Failed to process file {file_id}: {e}'}), 500

        
        return jsonify({'message': f'File {file_id} uploaded and queued for processing'}), 202



if __name__ == "__main__":
    flask_app.run(port=5000, use_reloader=True, threaded=True)