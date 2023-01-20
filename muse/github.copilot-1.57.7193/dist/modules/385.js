Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ExtensionTextDocumentManager = undefined;
const r = require("path");
const o = require("vscode");
const i = require(3136);
class ExtensionTextDocumentManager extends i.TextDocumentManager {
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
    var t;
    var n;
    var s;
    const a = e;
    if (a) {
      if (a.isUntitled) return;
      return null !==
        (s = i.getRelativePath(
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