# Copilot-Explorer

This is a tool meant for exploring the codebase of Github Copilot (the client side, not the model itself).

It's work in progress. See the [Journal](./Journal.md) for details on what's been done so far and my observations.

## Screenshots

![Screenshot 1](./images/screenshot-v0.png)

## Just show me the tool

You can access a version of the tool [here](codeviz/templates/code-viz.html).

This explores version 1.57.7193 of the VSCode extension of Copilot.

The webpage shows 3 panels:
- Left most shows the module-level callgraph of the extension. The dependencies are based on imports.
- Middle panel shows the prettified code of the selected module. By default the main module is selected.
- Right panel shows some information about the model (specifically, the module id, exports, imports and modules that import this module).

The modules don't have names because these have been extracted by a bit of deobfuscation, and the original obfuscated code didn't have names. I'm working on a way to provide reasonable names to the modules.

### Interesting modules

Some interesting modules I've found so far (most interesting at the **bottom**):
- **Prompting**:
  - [3055 (imported by 2533 and packs a ton of stuff)](codeviz/templates/code-viz.html#m3055)
    - 3055 was actually a jumbo module that had multiple nested modules in it. I extracted them as top level modules. Each of those modules begins with 3055\<something\>.
    - e.g., **the actual definition of `getPrompt` is in [3055312](codeviz/templates/code-viz.html#m3055312)**
  - [2388 seems to identify the repo to which the code belongs, and also suggests Copilot has different modes of completion: "OPEN_COPILOT", "TODO_QUICK_FIX", "UNKNOWN_FUNCTION_QUICK_FIX"](codeviz/templates/code-viz.html#m2388)
  - [9189 (does something with neighbouring tabs)](codeviz/templates/code-viz.html#m9189)  
  - [2533 (`parsesWithoutError`, `getPrompt`, `getNodeStart`, ... all useful stuff)](codeviz/templates/code-viz.html#m2533)

- **Completion**:
  - [9334 appears to handle stuff after prompt collection. It defines `getGhostText`.](codeviz/templates/code-viz.html#m9334). Depends on lots of other copilot modules. Only two hops away from the main module.
    - [3197 seems like a wrapper over 9334](codeviz/templates/code-viz.html#m3197). One hop from main.

- **Telemetry**:
  - [7017 seems to track changes after accept/reject of suggestions](codeviz/templates/code-viz.html#m7017).
  - [6333 appears to be the main Telemetry code](codeviz/templates/code-viz.html#m6333)

- **Network**:
  - [4419 (OpenAIFetcher) - this seems to be where the network communication takes place](codeviz/templates/code-viz.html#m4419)
      - [2279 (HelixFetcher. Seems to be an important library component mostly relevant to network)](codeviz/templates/code-viz.html#m2279)
      - [5413 (seems to control debouncing)](codeviz/templates/code-viz.html#m5413)

- **Misc**:
  - [9496 (`vscode` - things that import it are likely important)](codeviz/templates/code-viz.html#m9496)
  - [1862 (VSCodeCopilotTokenManager! - auth stuff)](codeviz/templates/code-viz.html#m1862)

## How to run locally

If you want to play with the code (different transformations, different visualizations, etc.), you can run the tool locally and modify the code.

1. Clone the repo
2. Run `npm install`
3. Run `node index.js` -- this processes the copilot extension code and produces modules by doing some automatic reverse engineering.

Steps 2 and 3 are optional. They're only needed if you modify the extension code or the transformation code. The repo already contains the processed modules.

4. Run `python3 code-viz/app.py` to start the app.
5. Head to `localhost:5000` in your browser.

## Support and Warranty

lmao