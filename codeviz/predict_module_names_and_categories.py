import json
from tqdm import tqdm
import sys
sys.path.append(__file__ + "/..")
from common import data_dir, module_deps
from predictions import predict_module_name, predict_module_category

def do_prediction(module_id, known_name=None, known_category=None):
    module_name = predict_module_name(module_id) if known_name is None else [known_name]
    name_is_predicted = known_name is None
    module_category = predict_module_category(module_id, module_name) if known_category is None else [known_category]
    category_is_predicted = known_category is None
    return {
        "name": module_name, "category": module_category,
        "name_is_predicted": name_is_predicted, "category_is_predicted": category_is_predicted
    }

# read gold_annotations.js
gold_annots = json.loads(open(data_dir / "gold_annotations.js").read().replace("let gold_annotations = ", ""))
# this file contains manual annotations for the modules. It's not necessary to have manual annotations, but it can help.

results = {}
for module_id in tqdm(module_deps):
    annots = gold_annots.get(f"module-annotations-{module_id}", {})
    module_name = annots.get("label", None)
    module_category = annots.get("category", None)
    module_info = do_prediction(module_id, module_name, module_category)
    print(module_id, module_info)
    results[module_id] = module_info

# save results
with open(data_dir / "predicted_annotations.js", "w") as f:
    f.write("let predicted_annotations = " + json.dumps(results, indent=2))
