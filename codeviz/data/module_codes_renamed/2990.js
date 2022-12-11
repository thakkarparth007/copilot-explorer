Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.CopilotPanel = undefined;
const M_vscode = require("vscode");
const M_config_stuff = require("config-stuff");
const M_copilot_scheme = require("copilot-scheme");
const M_completion_context = require("completion-context");
const M_copilot_list_doc = require("copilot-list-doc");
const M_post_accept_or_reject_tasks = require("post-accept-or-reject-tasks");
const M_copilot_vscode_cmds = require("copilot-vscode-cmds");
exports.CopilotPanel = class {
  constructor(e) {
    this._onDidChange = new M_vscode.EventEmitter();
    this._documents = new Map();
    this._editorDecoration = M_vscode.window.createTextEditorDecorationType({
      textDecoration: "underline",
    });
    this._ctx = e;
    this._subscriptions = M_vscode.workspace.onDidCloseTextDocument((e) => {
      if (e.isClosed && e.uri.scheme == M_copilot_scheme.CopilotScheme) {
        this._documents.delete(e.uri.toString());
      }
    });
  }
  dispose() {
    this._subscriptions.dispose();
    this._documents.clear();
    this._editorDecoration.dispose();
    this._onDidChange.dispose();
  }
  get onDidChange() {
    return this._onDidChange.event;
  }
  async provideTextDocumentContent(e) {
    var t;
    let n =
      null === (t = this._documents.get(e.toString())) || undefined === t
        ? undefined
        : t.model;
    if (n) return n.value;
    const i = new M_vscode.CancellationTokenSource();
    const [c, l] = M_completion_context.decodeLocation(this._ctx, e);
    const u = await M_vscode.workspace.openTextDocument(c);
    n = new M_copilot_list_doc.CopilotListDocument(
      this._ctx,
      e,
      u,
      l,
      M_config_stuff.getConfig(this._ctx, M_config_stuff.ConfigKey.ListCount),
      i.token
    );
    n.onDidResultUpdated((e) => this._onDidChange.fire(e));
    this._documents.set(e.toString(), {
      model: n,
      cts: i,
    });
    n.runQuery();
    return n.value;
  }
  getCodeLens(e) {
    const t = e.model;
    let n = t.numberHeaderLines;
    const o = t.completionContext.insertPosition;
    const i =
      M_copilot_list_doc.CopilotListDocument.separator.split("\n").length - 1;
    return t.solutions().map((a, u) => {
      const d = new M_vscode.Position(n + i, 0);
      const p = new M_vscode.Position(n + a.displayLines.length - 1, 0);
      const h = t.savedTelemetryData.extendedBy(
        {
          choiceIndex: a.choiceIndex.toString(),
        },
        {
          compCharLen: a.completionText.length,
          meanProb: a.meanProb,
          rank: u,
        }
      );
      h.extendWithRequestId(a.requestId);
      h.markAsDisplayed();
      const f = new M_vscode.CodeLens(new M_vscode.Range(d, p), {
        title: "Accept Solution",
        tooltip: "Replace code with this solution",
        command: M_copilot_vscode_cmds.CMDAcceptPanelSolution,
        arguments: [
          t.targetUri,
          o,
          a.completionText,
          t.completionContext.completionType ===
            M_completion_context.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX,
          async () => {
            const n = (
              await M_vscode.workspace.openTextDocument(t.targetUri)
            ).offsetAt(o);
            e.cts.cancel();
            await M_post_accept_or_reject_tasks.postInsertionTasks(
              this._ctx,
              "solution",
              a.completionText,
              n,
              t.targetUri,
              h
            );
          },
        ],
      });
      n += a.displayLines.length;
      return f;
    });
  }
  provideCodeLenses(e, t) {
    const n = this._documents.get(e.uri.toString());
    if (n) return this.getCodeLens(n);
  }
};
