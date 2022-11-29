# Path: flask\app.py

# A simple Flask app
from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
from pathlib import Path
app = Flask(__name__)


cur_dir = Path(__file__).parent
muse_dir = cur_dir / '../muse/github.copilot-1.57.7193/dist'
module_deps_data = "let module_deps_data = " + open(muse_dir/'module_deps.json').read()


@app.route('/')
def home():
    return render_template('code-viz.html')

@app.route('/data/module_deps.js')
def get_module_deps_data():
    return module_deps_data

@app.route('/data/module_code/<module_id>')
def get_module_code(module_id):
    with open(muse_dir / 'modules' / (module_id + '.js')) as f:
        return f.read()

if __name__ == '__main__':
    app.run(debug=True)