Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.decodeLocation =
  exports.encodeLocation =
  exports.completionContextForDocument =
  exports.CompletionContext =
  exports.completionTypeToString =
  exports.CompletionType =
    undefined;
const r = require(7373);
const o = require(6403);
const i = require(4197);
var s;
!(function (e) {
  e[(e.OPEN_COPILOT = 2)] = "OPEN_COPILOT";
  e[(e.TODO_QUICK_FIX = 3)] = "TODO_QUICK_FIX";
  e[(e.UNKNOWN_FUNCTION_QUICK_FIX = 4)] = "UNKNOWN_FUNCTION_QUICK_FIX";
})((s = exports.CompletionType || (exports.CompletionType = {})));
exports.completionTypeToString = function (e) {
  switch (e) {
    case s.OPEN_COPILOT:
      return "open copilot";
    case s.TODO_QUICK_FIX:
      return "todo quick fix";
    case s.UNKNOWN_FUNCTION_QUICK_FIX:
      return "unknown function quick fix";
    default:
      return "unknown";
  }
};
class CompletionContext {
  constructor(e, t, n) {
    this.prependToCompletion = "";
    this.appendToCompletion = "";
    this.indentation = null;
    this.completionType = s.OPEN_COPILOT;
    this.insertPosition = e
      .get(o.LocationFactory)
      .position(t.line, t.character);
    this.completionType = n;
  }
  static fromJSONParse(e, t) {
    const n = e
      .get(o.LocationFactory)
      .position(t.insertPosition.line, t.insertPosition.character);
    const r = new CompletionContext(e, n, t.completionType);
    r.prependToCompletion = t.prependToCompletion;
    r.appendToCompletion = t.appendToCompletion;
    r.indentation = t.indentation;
    return r;
  }
}
exports.CompletionContext = CompletionContext;
exports.completionContextForDocument = function (e, t, n) {
  let r = n;
  const o = t.lineAt(n.line);
  if (o.isEmptyOrWhitespace) {
    r = o.range.end;
  }
  return new CompletionContext(e, r, s.OPEN_COPILOT);
};
let c = 0;
exports.encodeLocation = function (e, t) {
  const n = e.toString().split("#");
  const o = n.length > 1 ? n[1] : "";
  const s = JSON.stringify([n[0], t, o]);
  return r.URI.parse(`${i.CopilotScheme}:GitHub%20Copilot?${s}#${c++}`);
};
exports.decodeLocation = function (e, t) {
  const [n, o, i] = JSON.parse(t.query);
  return [
    r.URI.parse(i.length > 0 ? n + "#" + i : n),
    CompletionContext.fromJSONParse(e, o),
  ];
};