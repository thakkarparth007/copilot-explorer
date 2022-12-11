Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ExtensionTextDocumentManager = undefined;
const M_path = require("path");
const M_vscode = require("vscode");
const M_text_doc_relative_path = require("text-doc-relative-path");
class ExtensionTextDocumentManager extends M_text_doc_relative_path.TextDocumentManager {
  constructor() {
    super(...arguments);
    this.onDidFocusTextDocument = M_vscode.window.onDidChangeActiveTextEditor;
    this.onDidChangeTextDocument = M_vscode.workspace.onDidChangeTextDocument;
  }
  get textDocuments() {
    return M_vscode.workspace.textDocuments;
  }
  async getTextDocument(e) {
    return M_vscode.workspace.openTextDocument(e);
  }
  async getRelativePath(e) {
    var t;
    var n;
    var s;
    const a = e;
    if (a) {
      if (a.isUntitled) return;
      return null !==
        (s = M_text_doc_relative_path.getRelativePath(
          null !==
            (n =
              null === (t = M_vscode.workspace.workspaceFolders) ||
              undefined === t
                ? undefined
                : t.map((e) => e.uri)) && undefined !== n
            ? n
            : [],
          a.fileName
        )) && undefined !== s
        ? s
        : M_path.basename(a.fileName);
    }
  }
  findNotebook(e) {
    const t = e;
    return M_vscode.workspace.notebookDocuments.find((e) =>
      e.getCells().some((e) => e.document === t)
    );
  }
}
exports.ExtensionTextDocumentManager = ExtensionTextDocumentManager;
