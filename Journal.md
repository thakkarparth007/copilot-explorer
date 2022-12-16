## Nov 12:

1. Beautify minified code using [jsviewer](https://codebeautify.org/jsviewer).

2. Remove the immediate execution of the function to simplify analysis (not really needed but did it anyway).

3. Experiment with babeljs via astexplorer.net for different transformations.
   Helpful links:
    - https://lihautan.com/manipulating-ast-with-javascript/#traversing-an-ast
    - https://lihautan.gumroad.com/l/manipulating-ast-with-javascript (unused)
    - https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
    - https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#programs
    - https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js (unused)

4. These transformations helped in extracting modules from the code, and also prettifying them a bit.

5. So far I've been able to extract dependency graph of modules along with the modules themselves.

6. WIP: Dependency graph may not be fully complete because I only look at things like `n(123)` and not `n.nmd(123)`. Not sure if that's required but haven't thoroughly checked yet.

7. WIP: Extraction of "exports". Have done a half-assed job of it so far. Need to do a better job. Few things I'm missing:
   1. handling `e.exports`, `e.exports.default`, `t = ...` etc.

8. WIP: Getting a list of identifiers and visualizing the dependency graph with nodes showing the identifiers from the modules.

## Nov 28:

0. Some more transformations added.

1. Why are there unused imports??? So many modules require a module but don't do anything with it. The ones I saw didn't even have any side effects on being loaded. So wtf is going on? An example: module 5109. Gets imported 17 times but always unused.
   - on a closer look it does have a side-effect. It extends a module. weird, really weird.

2. Made a simple vizualization tool (very rudimentary as of now). Observations:
   - Lots of tiny modules
   - Exports of many modules aren't extracted correctly even when they should be (check red nodes)
   - Large number of modules are uninteresting or polyfills or library code. Need a way to filter these out.
   - Found some interesting modules:
     - 3458 (has references to github/visualstudio/cloudforge)
     - 2279 (HelixFetcher. Seems to be an important library component mostly relevant to network)
       - 5413 (seems to control debouncing)
     - 4419 (OpenAIFetcher)
     - 9189 (does something with neighbouring tabs)
     - 6333 (deals with telemetry)
     - 2901 (does some sort of filtering/processing of model output)
     - 9334 (FAT STUFF. depends on lots of other copilot modules. seems to be the main module or close to it)
     - 3197 depends on 9334
     - 6267 (says copilot requires codelens - check who imports this to see what parts of codelens are used)
     - 9496 (`vscode` - things that import it are likely important)
     - 3197 (no module imports this. seems to be the main module)
     - 1862 (VSCodeCopilotTokenManager!)
     - 2533 (`parsesWithoutError`, `getPrompt`, `getNodeStart`, ... all useful stuff)
       - 3055 (imported by 2533 and packs a ton of stuff)
      (See README.md for higher signal modules)

   - Color coded:
     - Red nodes: modules that aren't imported by anyone. These are likely top level modules.
     - Orange nodes: modules that don't import anyone. These are likely leaf nodes.
     - Green nodes: modules that import and are imported by others. These are intermediate nodes.

   The color coding is based on my dependency extraction code. That's not perfect yet. So the color coding is not perfect either. But it's a great starting point.

3. IMPORTANT PIECE MISSING: So far I've only extracted modules, but the REAL top level code is still untouched. That's in extension_expanded.js. Gotta work on that next.

## Nov 29-Dec 1:

1. Filtered out modules that are aliases or built-in nodejs modules. This reduced the number of modules by 37.

2. Provided means to rename modules with localStorage persistance. This isn't ideal. I'd like the annotations to persist in a central DB or allow PRs to the repo. But this is good enough for now.

3. Failed experiments with collpasing/expanding of nodes.

4. What's needed now are two things:
   1. Ability to mark nodes as "interesting" or "uninteresting". This will help in filtering out the noise.
   2. Renaming variables to make the code more readable. Here's an idea:
      1. Track data flow of variables.
      2. If any of the variables/fields the variable is assigned to has a readable name, then rename the variable to that name. If there are multiple, raise a conflict and let the user decide initially till we can automate it.

## Dec 6:

1. Enabled debug-level logging in copilot extension. Found some interesting things:
   1. Module 2209's actual name is "streamChoices" (very few modules choose to create their own loggers, so this isn't very useful for automation)
   2. Interesting logging strings:
      - `Getting completions for user-typing flow - remaining prefix` (found in v1.62, dk if it's there in our current version)
      - `[post-insertion] [2022-12-07T05:41:59.356Z] stillInCode: Found! Completion <...> in file <...> ...`
      - Many ABTestexperiment flags are enabled
      - Model name was found to be cushman-ml! Which means copilot is still based on 12B model. (found in v1.62, dk if it's there in our current version)
      - Model outputs seem to have logprobs set to null, meaning there might be a way to enable logprobs from client side.
      - Tokens are streamed one-word-at-a-time
      - Temperature was set to 0 and n=1 in my case.
      - Suffix appears to be used now!

## Dec 9:

1. Moved away from interesting/uninteresting modules to module categories.
2. Added script to predict module names and categories using codex (using few shot learning on the gold annotations).
3. Added script to rename imports and import variables.
4. Some UI changes.

## Dec 11:

Today I'm just manually going through some important modules. Would be good to be able to automate some of this. Let's see.

Found m1124 (`postprocess-choice`) which postProcesses each choice (where choice is a model output).
One of the things it does is check if the choice is repetitive (a common failure mode of LMs). If so, it removes it from the list of choices.
The repetiveness check is implemented in m9657 (`repetition-filter`)

m2388 is the bossman of the whole query-to-model-and-postprocess-output flow. It's called by a parent module (copilot-list-doc).

All these seem to be part of the flow where the user wants to see multiple completions in the copilot-panel on the side.

The inline/ghost completion workflow's bossman is 9334 (`ghost-text-provider`).
Although I'm confused if inline and ghots completions are the same...

I rewrote a bunch of m2388 code because that seemed to be important and my auto-refactoring work needs more time.

## Dec 13:

- More manual annotation of code -- focused on telemetry regarding post-insert/reject operations.
- Config seems to have some interesting stuff:
  - SuffixPercent
  - fimSuffixLengthThreshold
  - suffixMatchThreshold
  - getHiddenConfig
  Should maybe check this out and also the experiments/tasks module

## Dec 16:

- Finally annotated all the prompt-extraction logic.
- This took a lot of work, and should ideally be automated. Should happen sometime in future.
- Following modules are annotated:
  - 4969: prompt-extractor.js -- the entry point module
  - 3055312: get-prompt-actual.js -- this has the core logic for prompt extraction
  - 3055670: sibling-function-fetcher.js -- this has the logic for extracting sibling functions
  - 3055456: prompt-choices-and-wishlist.js -- this has the logic for extracting prompt choices and wishlist
  - 3055125: neighbor-snippet-selector.js -- this has the logic for extracting neighbor snippets
  - 3055179: imports-and-docs-extractor.js (didn't really annotate but looks simple enough and only implemented for typescript)

