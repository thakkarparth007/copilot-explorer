Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.OpenCopilotActionProvider = undefined;
const r = require("vscode"),
  o = require(256),
  i = require(6333),
  s = require(3060),
  a = require(4540);
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
      codeActionType: o.completionTypeToString(t),
    };
    i.telemetry(
      this.ctx,
      "codeAction.displayed",
      i.TelemetryData.createAndMarkAsIssued(n)
    );
  }
  async provideCodeActions(e, t, n, i) {
    var c;
    if (a.ignoreDocument(this.ctx, e)) return;
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
      const n = u[u.length - 1],
        i = this.indexOfGroup(u, u.length - 1);
      if (
        new r.Range(
          new r.Position(t.start.line, i),
          new r.Position(t.start.line, i + n.length)
        ).contains(t.start)
      ) {
        const t = new r.CodeAction(
            "Implement with GitHub Copilot",
            r.CodeActionKind.QuickFix
          ),
          n = {
            title: "Implement with GitHub Copilot",
            command: s.CMDOpenPanelForRange,
            arguments: [
              new o.CompletionContext(
                this.ctx,
                l.rangeIncludingLineBreak.end,
                o.CompletionType.TODO_QUICK_FIX
              ),
            ],
          };
        t.command = n;
        this.telemetryCodeAction(e, o.CompletionType.TODO_QUICK_FIX);
        return [t];
      }
    }
    const d = n.diagnostics.find((e) => "ts" === e.source && 2304 === e.code);
    if (d) {
      const t = await r.commands.executeCommand(
          "vscode.executeCodeActionProvider",
          e.uri,
          d.range
        ),
        n =
          null == t
            ? undefined
            : t.find((e) =>
                e.title.startsWith("Add missing function declaration")
              ),
        i =
          null === (c = null == n ? undefined : n.edit) || undefined === c
            ? undefined
            : c.get(e.uri).pop();
      if (i) {
        const t = new r.CodeAction(
            "Implement with GitHub Copilot",
            r.CodeActionKind.QuickFix
          ),
          n = new o.CompletionContext(
            this.ctx,
            i.range.start,
            o.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX
          ),
          a = i.newText.trim().split("\n")[0];
        n.prependToCompletion = "\n" + a;
        const c = {
          title: "Implement with GitHub Copilot",
          command: s.CMDOpenPanelForRange,
          arguments: [n],
        };
        t.command = c;
        this.telemetryCodeAction(
          e,
          o.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX
        );
        return [t];
      }
    }
  }
};