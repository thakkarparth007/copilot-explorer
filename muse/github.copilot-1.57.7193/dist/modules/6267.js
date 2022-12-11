Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.commandOpenPanel = exports.completionContextForEditor = undefined;
const r = require("vscode");
const o = require(256);
function completionContextForEditor(e, t, n) {
  return n || o.completionContextForDocument(e, t.document, t.selection.active);
}
exports.completionContextForEditor = completionContextForEditor;
exports.commandOpenPanel = function (e, t) {
  const n = r.window.activeTextEditor;
  if (!n) return;
  if (!r.workspace.getConfiguration("editor", n.document.uri).get("codeLens"))
    return void r.window
      .showInformationMessage(
        "GitHub Copilot Panel requires having Code Lens enabled. Please update your settings and then try again.",
        "Open Settings"
      )
      .then((e) => {
        if ("Open Settings" === e) {
          r.commands.executeCommand(
            "workbench.action.openSettings",
            "editor.codeLens"
          );
        }
      });
  t = completionContextForEditor(e, n, t);
  const s = o.encodeLocation(n.document.uri, t);
  const a = n.document.languageId;
  r.workspace.openTextDocument(s).then((e) => {
    r.languages.setTextDocumentLanguage(e, a);
    r.window.showTextDocument(e, r.ViewColumn.Beside);
  });
};