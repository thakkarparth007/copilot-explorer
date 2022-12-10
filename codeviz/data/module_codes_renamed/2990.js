Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.CopilotPanel = undefined;
const r = require("vscode"),
  M_config_stuff = require("config-stuff"),
  M_copilot_scheme = require("copilot-scheme"),
  M_completion_context = require("completion-context"),
  M_copilot_list_doc = require("copilot-list-doc"),
  M_post_accept_or_reject_tasks = require("post-accept-or-reject-tasks"),
  M_copilot_vscode_cmds = require("copilot-vscode-cmds");
exports.CopilotPanel = class {
  constructor(e) {
    this._onDidChange = new r.EventEmitter();
    this._documents = new Map();
    this._editorDecoration = r.window.createTextEditorDecorationType({
      textDecoration: "underline",
    });
    this._ctx = e;
    this._subscriptions = r.workspace.onDidCloseTextDocument((e) => {
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
    const i = new r.CancellationTokenSource(),
      [c, l] = M_completion_context.decodeLocation(this._ctx, e),
      u = await r.workspace.openTextDocument(c);
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
    const o = t.completionContext.insertPosition,
      i =
        M_copilot_list_doc.CopilotListDocument.separator.split("\n").length - 1;
    return t.solutions().map((a, u) => {
      const d = new r.Position(n + i, 0),
        p = new r.Position(n + a.displayLines.length - 1, 0),
        h = t.savedTelemetryData.extendedBy(
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
      const f = new r.CodeLens(new r.Range(d, p), {
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
              await r.workspace.openTextDocument(t.targetUri)
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
