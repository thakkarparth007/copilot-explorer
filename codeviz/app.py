# Path: flask\app.py

# A simple Flask app
from flask import Flask, render_template

from pathlib import Path
app = Flask(__name__)

cur_dir = Path(__file__).parent
data_dir = cur_dir / 'data'
module_deps_data = open(data_dir/'module_deps.js').read()
module_codes_data = open(data_dir/'module_codes.js').read()

@app.route('/')
def home():
    return render_template('code-viz.html')

@app.route('/data/module_deps.js')
def get_module_deps_data():
    return module_deps_data

@app.route('/data/module_codes.js')
def get_module_codes_data():
    return module_codes_data

if __name__ == '__main__':
    app.run(debug=True)