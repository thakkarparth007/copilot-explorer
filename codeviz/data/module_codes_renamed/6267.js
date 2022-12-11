Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.commandOpenPanel = exports.completionContextForEditor = undefined;
const M_vscode = require("vscode");
const M_completion_context = require("completion-context");
function completionContextForEditor(e, t, n) {
  return (
    n ||
    M_completion_context.completionContextForDocument(
      e,
      t.document,
      t.selection.active
    )
  );
}
exports.completionContextForEditor = completionContextForEditor;
exports.commandOpenPanel = function (e, t) {
  const n = M_vscode.window.activeTextEditor;
  if (!n) return;
  if (
    !M_vscode.workspace
      .getConfiguration("editor", n.document.uri)
      .get("codeLens")
  )
    return void M_vscode.window
      .showInformationMessage(
        "GitHub Copilot Panel requires having Code Lens enabled. Please update your settings and then try again.",
        "Open Settings"
      )
      .then((e) => {
        if ("Open Settings" === e) {
          M_vscode.commands.executeCommand(
            "workbench.action.openSettings",
            "editor.codeLens"
          );
        }
      });
  t = completionContextForEditor(e, n, t);
  const s = M_completion_context.encodeLocation(n.document.uri, t);
  const a = n.document.languageId;
  M_vscode.workspace.openTextDocument(s).then((e) => {
    M_vscode.languages.setTextDocumentLanguage(e, a);
    M_vscode.window.showTextDocument(e, M_vscode.ViewColumn.Beside);
  });
};
