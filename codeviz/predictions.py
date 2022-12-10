import json
import sys
import time
from manifest import Manifest

sys.path.append(__file__ + "/..")
from app import module_codes, module_deps, module_categories, data_dir

gold_annots = json.loads(open(data_dir / "gold_annotations.js").read().replace("let gold_annotations = ", ""))

M = Manifest(
    client_name = "openai",
    client_connection = "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",
    cache_name = "sqlite",
    cache_connection = "codeviz_openai_cache.db",
    engine = "code-davinci-002",
)

def predict_with_retries(*args, **kwargs):
    for _ in range(5):
        try:
            return M.run(*args, **kwargs)
        except Exception as e:
            if "too many requests" in str(e).lower():
                print("Too many requests, waiting 30 seconds...")
                time.sleep(30)
            continue
    raise Exception("Too many retries")

def collect_module_prediction_context(module_id):
    module_exports = module_deps[module_id]["exports"]
    module_exports = [m for m in module_exports if m != "default" and "complex-export" not in m]
    if len(module_exports) == 0:
        module_exports = ""
    else:
        module_exports = "It exports the following symbols: " + ", ".join(module_exports)
    
    # get module snippet
    module_code_snippet = module_codes[module_id]
    # snip to first 50 lines:
    module_code_snippet = module_code_snippet.split("\n")
    if len(module_code_snippet) > 50:
        module_code_snippet = "\n".join(module_code_snippet[:50]) + "\n..."
    else:
        module_code_snippet = "\n".join(module_code_snippet)
    
    return {"exports": module_exports, "snippet": module_code_snippet}

#### Name prediction ####

def _get_prompt_for_module_name_prediction(module_id):
    context = collect_module_prediction_context(module_id)
    module_exports = context["exports"]
    module_code_snippet = context["snippet"]

    prompt = f"""\
Consider the code snippet of an unmodule named.

{module_exports}

Here's a snippet from this module:
{module_code_snippet}

Suggest a name for this module. (e.g., "fs", "promptlib", "get-prompt-parsing-utils", "contextual-filter-manager", "language-marker-constants" etc.)
A: """
    return prompt

def get_examples_for_module_name_prediction(n=5):
    # pick some examples from the existing module names (read gold_annotations.js)
    # should help with model's outputs being more meaningful
    examples = []
    for module_id in module_deps:
        annots = gold_annots.get(f"module-annotations-{module_id}", {})
        if "label" in annots:
            examples.append((
                _get_prompt_for_module_name_prediction(module_id),
                annots["label"]
            ))
        if len(examples) >= n:
            break
    return examples

def get_prompt_with_examples_for_module_name_prediction(module_id):
    prompt = ""
    examples = get_examples_for_module_name_prediction()
    query = _get_prompt_for_module_name_prediction(module_id)
    for example in examples:
        prompt += example[0] + example[1] + "\n---\n"
    prompt += query
    return prompt

def predict_module_name(module_id, example_names: list = []):
    prompt = get_prompt_with_examples_for_module_name_prediction(module_id)
    responses = predict_with_retries(prompt, max_tokens=20, temperature=0.4, stop_token="\n", n=3, top_k_return=3)

    return list(set(responses))

#### Category prediction ####

def _get_prompt_for_module_category_prediction(module_id, module_name):
    # query codex to categorize a module into one of the pre-defined categories

    context = collect_module_prediction_context(module_id)
    module_exports = context["exports"]
    module_code_snippet = context["snippet"]

    categories = module_categories.keys()
    categories_list = "- " + "\n- ".join(categories)

    prompt = f"""\
Consider the code snippet of the module named {module_name}.

{module_exports}

Here's a snippet from this module:
{module_code_snippet}

Which of the following categories does this module belong to?
{categories_list}

Pick one of the above (e.g., "library" or "openai-network-comms")
A: """
    return prompt

def get_examples_for_module_category_prediction(n=5):
    # pick some examples from the existing module names (read gold_annotations.js)
    # should help with model's outputs being more meaningful
    examples = []
    for module_id in module_deps:
        annots = gold_annots.get(f"module-annotations-{module_id}", {})
        if "category" in annots and "label" in annots:
            examples.append((
                _get_prompt_for_module_category_prediction(module_id, annots["label"]),
                annots["category"]
            ))
        if len(examples) >= n:
            break
    return examples

def get_prompt_with_examples_for_module_category_prediction(module_id, module_name):
    prompt = ""
    examples = get_examples_for_module_category_prediction()
    query = _get_prompt_for_module_category_prediction(module_id, module_name)
    for example in examples:
        prompt += example[0] + example[1] + "\n---\n"
    prompt += query
    return prompt

def predict_module_category(module_id, module_name):
    prompt = get_prompt_with_examples_for_module_category_prediction(module_id, module_name)
    responses = predict_with_retries(prompt, max_tokens=10, temperature=0.1, stop_token="\n", n=3, top_k_return=3)

    return list(set(responses))