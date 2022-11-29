# Copilot-Explorer

This is an app is meant for exploring the codebase of Github Copilot.

It's a work in progress. See the [Journal](Journal.md) for details on what's been done so far.

## How to run

1. Clone the repo
2. Run `npm install`
3. Run `node index.js` -- this processes the copilot extension code and produces modules by doing some automatic reverse engineering.

Steps 2 and 3 are optional. They're only needed if you modify the extension code or the transformation code. The repo already contains the processed modules.

4. Run `python3 code-viz/app.py` to start the app.
5. Head to `localhost:5000` in your browser.

## Screenshots

![Screenshot 1](./images/screenshot-v0.png)