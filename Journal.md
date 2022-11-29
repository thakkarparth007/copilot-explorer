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