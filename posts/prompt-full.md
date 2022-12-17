```py
# Path: codeviz\app.py
# Compare this snippet from codeviz\predictions.py:
# import json
# import sys
# import time
# from manifest import Manifest
# 
# sys.path.append(__file__ + "/..")
# from common import module_codes, module_deps, module_categories, data_dir, cur_dir
# 
# gold_annots = json.loads(open(data_dir / "gold_annotations.js").read().replace("let gold_annotations = ", ""))
# 
# M = Manifest(
#     client_name = "openai",
#     client_connection = open(cur_dir / ".openai-api-key").read().strip(),
#     cache_name = "sqlite",
#     cache_connection = "codeviz_openai_cache.db",
#     engine = "code-davinci-002",
# )
# 
# def predict_with_retries(*args, **kwargs):
#     for _ in range(5):
#         try:
#             return M.run(*args, **kwargs)
#         except Exception as e:
#             if "too many requests" in str(e).lower():
#                 print("Too many requests, waiting 30 seconds...")
#                 time.sleep(30)
#                 continue
#             else:
#                 raise e
#     raise Exception("Too many retries")
# 
# def collect_module_prediction_context(module_id):
#     module_exports = module_deps[module_id]["exports"]
#     module_exports = [m for m in module_exports if m != "default" and "complex-export" not in m]
#     if len(module_exports) == 0:
#         module_exports = ""
#     else:
#         module_exports = "It exports the following symbols: " + ", ".join(module_exports)
#     
#     # get module snippet
#     module_code_snippet = module_codes[module_id]
#     # snip to first 50 lines:
#     module_code_snippet = module_code_snippet.split("\n")
#     if len(module_code_snippet) > 50:
#         module_code_snippet = "\n".join(module_code_snippet[:50]) + "\n..."
#     else:
#         module_code_snippet = "\n".join(module_code_snippet)
#     
#     return {"exports": module_exports, "snippet": module_code_snippet}
# 
# #### Name prediction ####
# 
# def _get_prompt_for_module_name_prediction(module_id):
#     context = collect_module_prediction_context(module_id)
#     module_exports = context["exports"]
#     module_code_snippet = context["snippet"]
# 
#     prompt = f"""\
# Consider the code snippet of an unmodule named.
# 
import json
from flask import Flask, render_template, request, send_from_directory
from common import *
from predictions import predict_snippet_description, predict_module_name

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

# predict name of a module given its id
@app.route('/api/predict_module_name', methods=['POST'])
def suggest_module_name():
    module_id = request.json['module_id']
    module_name = predict_module_name(module_id)
```