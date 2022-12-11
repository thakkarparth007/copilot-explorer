Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.OpenCopilotActionProvider = undefined;
const M_vscode = require("vscode");
const M_completion_context = require("completion-context");
const M_telemetry_stuff = require("telemetry-stuff");
const M_copilot_vscode_cmds = require("copilot-vscode-cmds");
const M_ignore_document_or_not = require("ignore-document-or-not");
exports.OpenCopilotActionProvider = class {
  constructor(e) {
    this.ctx = e;
    this.lastVersion = 0;
    this.lastRange = undefined;
  }
  indexOfGroup(e, t) {
    let n = e.index;
    for (let r = 1; r < t; r++) n += e[r].length;
    return n;
  }
  telemetryCodeAction(e, t) {
    const n = {
      languageId: e.languageId,
      codeActionType: M_completion_context.completionTypeToString(t),
    };
    M_telemetry_stuff.telemetry(
      this.ctx,
      "codeAction.displayed",
      M_telemetry_stuff.TelemetryData.createAndMarkAsIssued(n)
    );
  }
  async provideCodeActions(e, t, n, i) {
    var c;
    if (M_ignore_document_or_not.ignoreDocument(this.ctx, e)) return;
    const l = e.lineAt(t.start);
    if (
      e.version === this.lastVersion &&
      this.lastRange &&
      this.lastRange.isEqual(t)
    )
      return;
    this.lastVersion = e.version;
    this.lastRange = t;
    const u = /^(\W+)(todo)/i.exec(l.text);
    if (u) {
      const n = u[u.length - 1];
      const i = this.indexOfGroup(u, u.length - 1);
      if (
        new M_vscode.Range(
          new M_vscode.Position(t.start.line, i),
          new M_vscode.Position(t.start.line, i + n.length)
        ).contains(t.start)
      ) {
        const t = new M_vscode.CodeAction(
          "Implement with GitHub Copilot",
          M_vscode.CodeActionKind.QuickFix
        );
        const n = {
          title: "Implement with GitHub Copilot",
          command: M_copilot_vscode_cmds.CMDOpenPanelForRange,
          arguments: [
            new M_completion_context.CompletionContext(
              this.ctx,
              l.rangeIncludingLineBreak.end,
              M_completion_context.CompletionType.TODO_QUICK_FIX
            ),
          ],
        };
        t.command = n;
        this.telemetryCodeAction(
          e,
          M_completion_context.CompletionType.TODO_QUICK_FIX
        );
        return [t];
      }
    }
    const d = n.diagnostics.find((e) => "ts" === e.source && 2304 === e.code);
    if (d) {
      const t = await M_vscode.commands.executeCommand(
        "vscode.executeCodeActionProvider",
        e.uri,
        d.range
      );
      const n =
        null == t
          ? undefined
          : t.find((e) =>
              e.title.startsWith("Add missing function declaration")
            );
      const i =
        null === (c = null == n ? undefined : n.edit) || undefined === c
          ? undefined
          : c.get(e.uri).pop();
      if (i) {
        const t = new M_vscode.CodeAction(
          "Implement with GitHub Copilot",
          M_vscode.CodeActionKind.QuickFix
        );
        const n = new M_completion_context.CompletionContext(
          this.ctx,
          i.range.start,
          M_completion_context.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX
        );
        const a = i.newText.trim().split("\n")[0];
        n.prependToCompletion = "\n" + a;
        const c = {
          title: "Implement with GitHub Copilot",
          command: M_copilot_vscode_cmds.CMDOpenPanelForRange,
          arguments: [n],
        };
        t.command = c;
        this.telemetryCodeAction(
          e,
          M_completion_context.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX
        );
        return [t];
      }
    }
  }
};
