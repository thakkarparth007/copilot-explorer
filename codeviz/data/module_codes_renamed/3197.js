Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.registerGhostText =
  exports.handleGhostTextPostInsert =
  exports.handleGhostTextShown =
  exports.provideInlineCompletions =
  exports.ghostTextLogger =
  exports.getInsertionTextFromCompletion =
    undefined;
const M_vscode = require("vscode");
const M_config_stuff = require("config-stuff");
const M_completion_from_ghost_text = require("completion-from-ghost-text");
const M_ghost_text_provider = require("ghost-text-provider");
const M_ghost_text_telemetry = require("ghost-text-telemetry");
const M_logging_utils = require("logging-utils");
const M_post_accept_or_reject_tasks = require("post-accept-or-reject-tasks");
const M_telemetry_stuff = require("telemetry-stuff");
const M_ignore_document_or_not = require("ignore-document-or-not");
const p = "_ghostTextPostInsert";
function getInsertionTextFromCompletion(e) {
  return e.insertText;
}
let f;
let m;
exports.getInsertionTextFromCompletion = getInsertionTextFromCompletion;
exports.ghostTextLogger = new M_logging_utils.Logger(
  M_logging_utils.LogLevel.INFO,
  "ghostText"
);
let g;
let _ = [];
async function provideInlineCompletions(e, n, c, h, y) {
  const v = await (async function (e, n, a, c, h) {
    const y = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued();
    if (
      !(function (e) {
        return M_config_stuff.getConfig(
          e,
          M_config_stuff.ConfigKey.InlineSuggestEnable
        );
      })(e)
    )
      return {
        type: "abortedBeforeIssued",
        reason: "ghost text is disabled",
      };
    if (M_ignore_document_or_not.ignoreDocument(e, n))
      return {
        type: "abortedBeforeIssued",
        reason: "document is ignored",
      };
    exports.ghostTextLogger.debug(
      e,
      `Ghost text called at [${a.line}, ${a.character}], with triggerKind ${c.triggerKind}`
    );
    if (h.isCancellationRequested)
      return (
        exports.ghostTextLogger.info(e, "Cancelled before extractPrompt"),
        {
          type: "abortedBeforeIssued",
          reason: "cancelled before extractPrompt",
        }
      );
    if (c.selectedCompletionInfo) {
      exports.ghostTextLogger.debug(
        e,
        "Not showing ghost text because autocomplete widget is displayed"
      );
      return {
        type: "abortedBeforeIssued",
        reason: "autocomplete widget is displayed",
      };
    }
    const v = await M_ghost_text_provider.getGhostText(
      e,
      n,
      a,
      c.triggerKind === M_vscode.InlineCompletionTriggerKind.Invoke,
      y,
      h
    );
    if ("success" !== v.type) {
      exports.ghostTextLogger.debug(
        e,
        "Breaking, no results from getGhostText -- " + v.type + ": " + v.reason
      );
      return v;
    }
    const [b, w] = v.value;
    if (
      f &&
      m &&
      (!f.isEqual(a) || m !== n.uri) &&
      w !== M_ghost_text_provider.ResultType.TypingAsSuggested
    ) {
      const t = _.flatMap((e) =>
        e.displayText && e.telemetry
          ? [
              {
                completionText: e.displayText,
                completionTelemetryData: e.telemetry,
              },
            ]
          : []
      );
      if (t.length > 0) {
        M_post_accept_or_reject_tasks.postRejectionTasks(
          e,
          "ghostText",
          n.offsetAt(f),
          m,
          t
        );
      }
    }
    f = a;
    m = n.uri;
    _ = [];
    if (h.isCancellationRequested)
      return (
        exports.ghostTextLogger.info(e, "Cancelled after getGhostText"),
        {
          type: "canceled",
          reason: "after getGhostText",
          telemetryData: {
            telemetryBlob: v.telemetryBlob,
          },
        }
      );
    const x = M_completion_from_ghost_text.completionsFromGhostTextResults(
      e,
      b,
      w,
      n,
      a,
      (function (e) {
        const t = M_vscode.window.visibleTextEditors.find(
          (t) => t.document === e
        );
        return null == t ? undefined : t.options;
      })(n),
      g
    );
    exports.ghostTextLogger.debug(e, "Completions", x);
    const E = x.map((e) => {
      const { text: t, range: o } = e;
      const i = new M_vscode.Range(
        new M_vscode.Position(o.start.line, o.start.character),
        new M_vscode.Position(o.end.line, o.end.character)
      );
      const s = new M_vscode.InlineCompletionItem(t, i);
      s.index = e.index;
      s.telemetry = e.telemetry;
      s.displayText = e.displayText;
      s.resultType = e.resultType;
      s.uri = n.uri;
      s.insertOffset = n.offsetAt(
        new M_vscode.Position(e.position.line, e.position.character)
      );
      s.command = {
        title: "PostInsertTask",
        command: p,
        arguments: [s],
      };
      return s;
    });
    return 0 === E.length
      ? {
          type: "empty",
          reason: "no completions in final result",
          telemetryData: v.telemetryData,
        }
      : {
          ...v,
          value: E,
        };
  })(e, n, c, h, y);
  return await M_ghost_text_telemetry.handleGhostTextResultTelemetry(e, v);
}
exports.provideInlineCompletions = provideInlineCompletions;
class v {
  constructor(e) {
    this.ctx = e;
  }
  async provideInlineCompletionItems(e, t, n, r) {
    return provideInlineCompletions(this.ctx, e, t, n, r);
  }
  handleDidShowCompletionItem(e) {
    handleGhostTextShown(this.ctx, e);
  }
}
function handleGhostTextShown(e, n) {
  g = n.index;
  if (!_.find((e) => e.index === n.index) && (_.push(n), n.telemetry)) {
    const r = !(n.resultType === M_ghost_text_provider.ResultType.Network);
    exports.ghostTextLogger.debug(
      e,
      `[${n.telemetry.properties.headerRequestId}] shown choiceIndex: ${n.telemetry.properties.choiceIndex}, fromCache ${r}`
    ),
      (0, M_ghost_text_telemetry.telemetryShown)(
        e,
        "ghostText",
        n.telemetry,
        r
      );
  }
}
async function handleGhostTextPostInsert(e, n) {
  _ = [];
  m = undefined;
  f = undefined;
  exports.ghostTextLogger.debug(e, "Ghost text post insert");
  if (
    n.telemetry &&
    n.uri &&
    n.displayText &&
    undefined !== n.insertOffset &&
    n.range
  ) {
    n.telemetry.measurements.compCharLen =
      getInsertionTextFromCompletion(n).length;
    await M_post_accept_or_reject_tasks.postInsertionTasks(
      e,
      "ghostText",
      n.displayText,
      n.insertOffset,
      n.uri,
      n.telemetry
    );
  }
}
exports.handleGhostTextShown = handleGhostTextShown;
exports.handleGhostTextPostInsert = handleGhostTextPostInsert;
exports.registerGhostText = function (e) {
  const t = new v(e);
  return [
    M_vscode.languages.registerInlineCompletionItemProvider(
      {
        pattern: "**",
      },
      t
    ),
    M_vscode.commands.registerCommand(p, async (t) =>
      handleGhostTextPostInsert(e, t)
    ),
  ];
};
