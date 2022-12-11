import json

from pathlib import Path

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
