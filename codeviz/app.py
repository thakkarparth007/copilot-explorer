import json
from flask import Flask, render_template, request, send_from_directory

from pathlib import Path
app = Flask(__name__)

cur_dir = Path(__file__).parent
data_dir = cur_dir / 'data'

def load_data():
    module_categories = open(data_dir / 'module_categories.js').read()
    module_categories = json.loads(module_categories.replace("let module_categories = ", ""))

    module_deps = open(data_dir/'module_deps.js').read().replace("let module_deps_data = ", "")
    module_deps = json.loads(module_deps)

    module_codes = open(data_dir/'module_codes.js').read().replace("let module_codes_data = ", "")
    module_codes = json.loads(module_codes)

    return module_categories, module_deps, module_codes

module_categories, module_deps, module_codes = load_data()

@app.route('/')
def home():
    return render_template('code-viz.html')

@app.route('/data/<path:filename>')
def get_data_files(filename):
    return send_from_directory(data_dir, filename)

@app.route('/api/suggest_module_name')
def suggest_module_name():
    module_id = request.args.get('module_id')
    module_name = predict_module_name(module_id)
    return json.dumps(module_name)

@app.route('/api/suggest_module_category')
def suggest_module_category():
    module_id = request.args.get('module_id')
    module_name = request.args.get('module_name')
    
    categories = predict_module_category(module_id, module_name)
    return json.dumps(categories)

if __name__ == '__main__':
    app.run(debug=True)