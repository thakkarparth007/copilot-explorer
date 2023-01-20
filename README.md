# Copilot-Explorer

This is a tool meant for exploring the codebase of Github Copilot (the client side, not the model itself).

It's work in progress. See the [Journal](https://thakkarparth007.github.io/copilot-explorer/Journal) for details on what's been done so far and my observations.

There's a [blog post](https://thakkarparth007.github.io/copilot-explorer/posts/copilot-internals) that explains the high level findings, and provides necessary code pointers.

## Screenshots

![Screenshot 1](./images/screenshot-v1.png)

## Just show me the tool

You can access a version of the tool [here](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html).

This explores version 1.57.7193 of the VSCode extension of Copilot.

The webpage shows 3 panels:
- Left most shows the module-level dependency graph of the extension. The edges are based on imports.
- Middle panel shows the prettified code of the selected module. By default the main module is selected.
- Right panel shows some information about the model (specifically, the module id, exports, imports and modules that import this module).

<!-- The modules don't have names because these have been extracted by a bit of deobfuscation, and the original obfuscated code didn't have names. I'm working on a way to provide reasonable names to the modules. Currently I have a hacky system that allows manual renaming of modules, but it's not synced. Your edits do stay on local storage though. -->

**Module Names**: I've also named modules -- some of them manually, while most of them were automatically named using codex in a few-shot manner. Some names are not unique, and I've not dealt with that. IDs of every module are unique though.

**Module Categories**: I've similarly also categorized modules automatically (again using codex and a bit of manual labeling). The categories are not perfect, but they serve as a very good guideline for segregating modules.

**Manual annotations:** Some of the modules were quite interesting, so I manually annotated them (added comments and renamed variables) to make them easier to understand. These are now directly viewable in the middle panel. Links below.

If you want to start browsing, below are some interesting starting points.

**Navigation tips:**
- You can use the forward and back buttons to navigate through the history of modules you've visited.
- Within a module, use your regular VSCode shortcuts (e.g., ctrl+click will work for definitions within the same file). They don't work across modules. But I've renamed the modules to make them easier to navigate. So, e.g., in module A, if you see `M_prompt_extractor.getPrompt()`, then you know to look for `prompt-extractor` module in the right panel.
- The modules have been color coded so you can choose to ignore the modules you don't care about.

### Interesting modules

Some interesting modules I've found so far (these notes were written before I wrote the blog post, so some comments might be outdated):
- **Prompting**:
  - This is the most interesting part of the codebase to me. This is what brings all the smarts to Copilot apart from the model itself. The reason copilot can get function names right often is because of this stuff.
  - The following modules have been manually annotated and constitute most of all the magic:
      - [4969](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m4969): prompt-extractor.js -- the entry point module
      - [3055312](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m3055312): get-prompt-actual.js -- this has the core logic for prompt extraction
      - [3055670](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m3055670): sibling-function-fetcher.js -- this has the logic for extracting sibling functions
      - [3055456](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m3055456): prompt-choices-and-wishlist.js -- this has the logic for extracting prompt choices and wishlist
      - [3055125](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m3055125): neighbor-snippet-selector.js -- this has the logic for extracting neighbor snippets
      - [3055179](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m3055179): imports-and-docs-extractor.js (didn't really annotate but looks simple enough and only implemented for typescript)
  - For many languages, copilot calls the tree-sitter parser via WASM. There are some wrappers around that in [464](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m464).
  - [2388 (described below) tweaks the prompt a bit depending on different completion modes. Copilot has 3 modes of completion (in copilot panel flow): "OPEN_COPILOT", "TODO_QUICK_FIX", "UNKNOWN_FUNCTION_QUICK_FIX"](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m2388)

  - Note that there are some duplicate modules, idk why but I'm guessing webpack does something. So many modules starting with 3055... will have copies with other ids.

- **Completion**:
  There appear to be two main workflows for completion:
  - Inline-Completions (the stuff you most commonly use, where copilot autocompletes as you type).
    - [3197 appears to be the main module for this](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m3197). This is imported by the main module and it registers an inline-completion-provider. The `class v` there is actually the InlineCompletionItemProvider.
      <!-- ~- I've manually added some comments and renamed some variables to make it easier to understand. You can see the modified code [here](codeviz/data/manually_annotated_modules/3197.js).~ -->
    - [9334 appears to be the module that contains the core logic for inline completion. It defines `getGhostText`.](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m9334). Depends on lots of other copilot modules. Only two hops away from the main module. The core functionality appears to the following:
      - Use cached suggestions if available
      - If user is typing, provide suggestions that match the typed text
      - Make network call if necessary, while waiting for debouncing period to pass
      - Take care of cases where user is "cycling" through choices specially. Didn't pay much attention here.
      - A lot of recording of telemetry data
      <!-- - You can read my commented version of the code [here](codeviz/data/manually_annotated_modules/9334.js). -->
    - [2218 is a simple helper module that seems relevant too](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m2218)

  - Panel Completion (the stuff shown if you press ctrl+enter)
    - [2388 seems to contain the main logic for this](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m2388).
      - I've manually added some comments and renamed some variables to make it easier to understand. You can see the modified code [here](codeviz/data/manually_annotated_modules/2388.js).
    - [893 seems like a wrapper over 2388](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m893)
    - [2990 is the main copilot-panel module](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m2990). This is imported by the main module. You can see this contains the "Accept Solution" and "Replace code with this solution" buttons.

- **Telemetry**:
  - [7017 seems to track changes after accept/reject of suggestions](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m7017).
    - The most interesting thing to me here was that they measure the effectiveness of the insertion at 5 points -- 15s/30s/2min/5min/10min after the suggestion was accepted. For rejection, they only capture after 30s (other timestamps are ignored).
    - At these timestamps, they measure how much of the suggestion was still present in a window around the insertion point.
      - The above is quantified in terms of edit-distance (at character level and at token-level. A token is most likely just stuff separated by spaces or something like that. Details can be found in [5120](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m5120))
      - Haven't fully understood the details of the measurement. Will need to play around a bit more to understand this.
    - Also, at the 30s timestamp, the telemetry calls "captureCode" (regardless of whether the suggestion was accepted or rejected). Here they basically look at the insertion point, extract the prompt that'd be used to make a suggestion at this insertion point (idk why they re-extract instead of caching it), and also extract stuff after the insertion point till some length they compute. Haven't yet understood till where they look after the insertion point.
  - [6333 appears to be the main Telemetry code](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m6333)

- **Network**:
  - [4419 (OpenAIFetcher) - this seems to be where the network communication with the model takes place](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m4419)
      - [2279 (HelixFetcher. Seems to be an important library component mostly relevant to network)](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m2279)
      - [5413 (seems to control debouncing)](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m5413)

- **Misc**:
  - [9496 (`vscode` - things that import it are likely important)](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m9496)
  - [1862 (VSCodeCopilotTokenManager! - auth stuff)](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m1862)

- **Config/Experiments**:
  - Copilot has some variables that are controlled via A/B tests I think. I haven't fully explored this stuff yet, but I do plan to.
  - The main module for this is [9189](https://thakkarparth007.github.io/copilot-explorer/codeviz/templates/code-viz.html#m9189). Take a look at the "Features" class.

## How to run locally

If you want to play with the code (different transformations, different visualizations, etc.), you can run the tool locally and modify the code.

1. Clone the repo
2. Run `npm install`
3. Run `node index.js` -- this processes the copilot extension code and produces modules by doing some automatic reverse engineering.

Steps 2 and 3 are optional. They're only needed if you modify the extension code or the transformation code. The repo already contains the processed modules.

4. Create a file named `code-viz/.openai-api-key` storing your OpenAI API key. You can keep this empty if you're not going to predict names and categories, or going to use the `select-snippet -> right-click -> Describe this snippet` feature (which doesn't work that well anyway).
5. Run `python3 code-viz/app.py` to start the app.
6. Head to `localhost:5000` in your browser.


### Manual annotations

The tool supports 3 types of annotations: (a) module names (b) module categories (c) module code.

You can change the first two annotations (rename/recategorize modules) by the UI. These annotations persist in your localstorage. If you want to export them, you can use browser console to do so. I know this isn't ideal, but hey this is a hacky repo. I doubt anyone will reannotate stuff seriously.

For module code -- if you find a particular module interesting and want to add your comments, you can do that and save the annotated module under `codeviz/data/manually_annotated_modules/<module_id>.js`. Finally, run `codeviz/compress_annotated_codes.js` which takes all the annotated modules and puts them in a single file that's loaded in the browser...so that your annotations show up in the UI.

## Support and Warranty

lmao

But seriously, this is all on a best-effort basis, I might've misunderstood a few things and so the conclusions might be slightly off. If you find something, do raise an issue or a PR.