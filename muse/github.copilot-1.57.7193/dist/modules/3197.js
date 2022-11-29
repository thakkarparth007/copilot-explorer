Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerGhostText = exports.handleGhostTextPostInsert = exports.handleGhostTextShown = exports.provideInlineCompletions = exports.ghostTextLogger = exports.getInsertionTextFromCompletion = undefined;
const r = require(9496),
  o = require(1133),
  i = require(2218),
  s = require(9334),
  a = require(750),
  c = require(9899),
  l = require(7017),
  u = require(6333),
  d = require(4540),
  p = "_ghostTextPostInsert";
function getInsertionTextFromCompletion(e) {
  return e.insertText;
}
let f, m;
exports.getInsertionTextFromCompletion = getInsertionTextFromCompletion;
exports.ghostTextLogger = new c.Logger(c.LogLevel.INFO, "ghostText");
let g,
  _ = [];
async function provideInlineCompletions(e, n, c, h, y) {
  const v = await async function (e, n, a, c, h) {
    const y = u.TelemetryData.createAndMarkAsIssued();
    if (!function (e) {
      return o.getConfig(e, o.ConfigKey.InlineSuggestEnable);
    }(e)) return {
      type: "abortedBeforeIssued",
      reason: "ghost text is disabled"
    };
    if (d.ignoreDocument(e, n)) return {
      type: "abortedBeforeIssued",
      reason: "document is ignored"
    };
    exports.ghostTextLogger.debug(e, `Ghost text called at [${a.line}, ${a.character}], with triggerKind ${c.triggerKind}`);
    if (h.isCancellationRequested) return exports.ghostTextLogger.info(e, "Cancelled before extractPrompt"), {
      type: "abortedBeforeIssued",
      reason: "cancelled before extractPrompt"
    };
    if (c.selectedCompletionInfo) {
      exports.ghostTextLogger.debug(e, "Not showing ghost text because autocomplete widget is displayed");
      return {
        type: "abortedBeforeIssued",
        reason: "autocomplete widget is displayed"
      };
    }
    const v = await s.getGhostText(e, n, a, c.triggerKind === r.InlineCompletionTriggerKind.Invoke, y, h);
    if ("success" !== v.type) {
      exports.ghostTextLogger.debug(e, "Breaking, no results from getGhostText -- " + v.type + ": " + v.reason);
      return v;
    }
    const [b, w] = v.value;
    if (f && m && (!f.isEqual(a) || m !== n.uri) && w !== s.ResultType.TypingAsSuggested) {
      const t = _.flatMap(e => e.displayText && e.telemetry ? [{
        completionText: e.displayText,
        completionTelemetryData: e.telemetry
      }] : []);
      t.length > 0 && l.postRejectionTasks(e, "ghostText", n.offsetAt(f), m, t);
    }
    f = a;
    m = n.uri;
    _ = [];
    if (h.isCancellationRequested) return exports.ghostTextLogger.info(e, "Cancelled after getGhostText"), {
      type: "canceled",
      reason: "after getGhostText",
      telemetryData: {
        telemetryBlob: v.telemetryBlob
      }
    };
    const x = i.completionsFromGhostTextResults(e, b, w, n, a, function (e) {
      const t = r.window.visibleTextEditors.find(t => t.document === e);
      return null == t ? undefined : t.options;
    }(n), g);
    exports.ghostTextLogger.debug(e, "Completions", x);
    const E = x.map(e => {
      const {
          text: t,
          range: o
        } = e,
        i = new r.Range(new r.Position(o.start.line, o.start.character), new r.Position(o.end.line, o.end.character)),
        s = new r.InlineCompletionItem(t, i);
      s.index = e.index;
      s.telemetry = e.telemetry;
      s.displayText = e.displayText;
      s.resultType = e.resultType;
      s.uri = n.uri;
      s.insertOffset = n.offsetAt(new r.Position(e.position.line, e.position.character));
      s.command = {
        title: "PostInsertTask",
        command: p,
        arguments: [s]
      };
      return s;
    });
    return 0 === E.length ? {
      type: "empty",
      reason: "no completions in final result",
      telemetryData: v.telemetryData
    } : {
      ...v,
      value: E
    };
  }(e, n, c, h, y);
  return await a.handleGhostTextResultTelemetry(e, v);
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
  if (!_.find(e => e.index === n.index) && (_.push(n), n.telemetry)) {
    const r = !(n.resultType === s.ResultType.Network);
    exports.ghostTextLogger.debug(e, `[${n.telemetry.properties.headerRequestId}] shown choiceIndex: ${n.telemetry.properties.choiceIndex}, fromCache ${r}`), (0, a.telemetryShown)(e, "ghostText", n.telemetry, r);
  }
}
async function handleGhostTextPostInsert(e, n) {
  _ = [];
  m = undefined;
  f = undefined;
  exports.ghostTextLogger.debug(e, "Ghost text post insert");
  n.telemetry && n.uri && n.displayText && undefined !== n.insertOffset && n.range && (n.telemetry.measurements.compCharLen = getInsertionTextFromCompletion(n).length, await l.postInsertionTasks(e, "ghostText", n.displayText, n.insertOffset, n.uri, n.telemetry));
}
exports.handleGhostTextShown = handleGhostTextShown;
exports.handleGhostTextPostInsert = handleGhostTextPostInsert;
exports.registerGhostText = function (e) {
  const t = new v(e);
  return [r.languages.registerInlineCompletionItemProvider({
    pattern: "**"
  }, t), r.commands.registerCommand(p, async t => handleGhostTextPostInsert(e, t))];
};