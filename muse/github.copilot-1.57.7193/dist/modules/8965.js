Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.contextualFilterScore =
  exports.getLastLineLength =
  exports.ContextualFilterManager =
    undefined;
const r = require(7744);
class ContextualFilterManager {
  constructor() {
    this.previousLabel = 0;
    this.previousLabelTimestamp = Date.now() - 3600;
    this.probabilityAccept = 0;
  }
}
function getLastLineLength(e) {
  const t = e.split("\n");
  return t[t.length - 1].length;
}
exports.ContextualFilterManager = ContextualFilterManager;
exports.getLastLineLength = getLastLineLength;
exports.contextualFilterScore = function (e, t, n) {
  const s = e.get(ContextualFilterManager),
    a = s.previousLabel;
  let c = 0;
  if (
    "afterCursorWhitespace" in t.properties &&
    "true" === t.properties.afterCursorWhitespace
  ) {
    c = 1;
  }
  const l = (Date.now() - s.previousLabelTimestamp) / 1e3,
    u = Math.log(1 + l);
  let d = 0,
    p = 0;
  const h = n.prefix;
  if (h) {
    d = Math.log(1 + getLastLineLength(h));
    const e = h.slice(-1);
    if (undefined !== r.contextualFilterCharacterMap[e]) {
      p = r.contextualFilterCharacterMap[e];
    }
  }
  let f = 0,
    m = 0;
  const g = h.trimEnd();
  if (g) {
    f = Math.log(1 + getLastLineLength(g));
    const e = g.slice(-1);
    if (undefined !== r.contextualFilterCharacterMap[e]) {
      m = r.contextualFilterCharacterMap[e];
    }
  }
  let _ = 0;
  if ("documentLength" in t.measurements) {
    const e = t.measurements.documentLength;
    _ = Math.log(1 + e);
  }
  let y = 0;
  if ("promptEndPos" in t.measurements) {
    const e = t.measurements.promptEndPos;
    y = Math.log(1 + e);
  }
  let v = 0;
  if ("promptEndPos" in t.measurements && "documentLength" in t.measurements) {
    const e = t.measurements.documentLength;
    v = (t.measurements.promptEndPos + 0.5) / (1 + e);
  }
  let b = 0;
  if (undefined !== r.contextualFilterLanguageMap[t.properties.languageId]) {
    b = r.contextualFilterLanguageMap[t.properties.languageId];
  }
  let w = r.contextualFilterIntercept;
  w += r.contextualFilterWeights[0] * a;
  w += r.contextualFilterWeights[1] * c;
  w += r.contextualFilterWeights[2] * u;
  w += r.contextualFilterWeights[3] * d;
  w += r.contextualFilterWeights[4] * f;
  w += r.contextualFilterWeights[5] * _;
  w += r.contextualFilterWeights[6] * y;
  w += r.contextualFilterWeights[7] * v;
  w += r.contextualFilterWeights[8 + b];
  w += r.contextualFilterWeights[29 + p];
  w += r.contextualFilterWeights[125 + m];
  const x = 1 / (1 + Math.exp(-w));
  e.get(ContextualFilterManager).probabilityAccept = x;
  return x;
};