Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ExtensionTextDocumentManager = undefined;
const r = require("path"),
  o = require("vscode"),
  M_text_doc_relative_path = require("text-doc-relative-path");
class ExtensionTextDocumentManager extends M_text_doc_relative_path.TextDocumentManager {
  constructor() {
    super(...arguments);
    this.onDidFocusTextDocument = o.window.onDidChangeActiveTextEditor;
    this.onDidChangeTextDocument = o.workspace.onDidChangeTextDocument;
  }
  get textDocuments() {
    return o.workspace.textDocuments;
  }
  async getTextDocument(e) {
    return o.workspace.openTextDocument(e);
  }
  async getRelativePath(e) {
    var t, n, s;
    const a = e;
    if (a) {
      if (a.isUntitled) return;
      return null !==
        (s = M_text_doc_relative_path.getRelativePath(
          null !==
            (n =
              null === (t = o.workspace.workspaceFolders) || undefined === t
                ? undefined
                : t.map((e) => e.uri)) && undefined !== n
            ? n
            : [],
          a.fileName
        )) && undefined !== s
        ? s
        : r.basename(a.fileName);
    }
  }
  findNotebook(e) {
    const t = e;
    return o.workspace.notebookDocuments.find((e) =>
      e.getCells().some((e) => e.document === t)
    );
  }
}
exports.ExtensionTextDocumentManager = ExtensionTextDocumentManager;
