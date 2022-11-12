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