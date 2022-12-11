import json
from flask import Flask, render_template, request, send_from_directory
from common import *
from predictions import predict_snippet_description

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('code-viz.html')

@app.route('/data/<path:filename>')
def get_data_files(filename):
    return send_from_directory(data_dir, filename)

@app.route('/api/describe_snippet', methods=['POST'])
def describe_snippet():
    module_id = request.json['module_id']
    module_name = request.json['module_name']
    snippet = request.json['snippet']
    description = predict_snippet_description(
        module_id,
        module_name,
        snippet,
    )
    return json.dumps({'description': description})

if __name__ == '__main__':
    app.run(debug=True)