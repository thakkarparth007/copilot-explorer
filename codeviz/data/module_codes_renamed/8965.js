Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.contextualFilterScore =
  exports.getLastLineLength =
  exports.ContextualFilterManager =
    undefined;
const M_contextual_filter_constants = require("contextual-filter-constants");
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
  const s = e.get(ContextualFilterManager);
  const a = s.previousLabel;
  let c = 0;
  if (
    "afterCursorWhitespace" in t.properties &&
    "true" === t.properties.afterCursorWhitespace
  ) {
    c = 1;
  }
  const l = (Date.now() - s.previousLabelTimestamp) / 1e3;
  const u = Math.log(1 + l);
  let d = 0;
  let p = 0;
  const h = n.prefix;
  if (h) {
    d = Math.log(1 + getLastLineLength(h));
    const e = h.slice(-1);
    if (
      undefined !==
      M_contextual_filter_constants.contextualFilterCharacterMap[e]
    ) {
      p = M_contextual_filter_constants.contextualFilterCharacterMap[e];
    }
  }
  let f = 0;
  let m = 0;
  const g = h.trimEnd();
  if (g) {
    f = Math.log(1 + getLastLineLength(g));
    const e = g.slice(-1);
    if (
      undefined !==
      M_contextual_filter_constants.contextualFilterCharacterMap[e]
    ) {
      m = M_contextual_filter_constants.contextualFilterCharacterMap[e];
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
  if (
    undefined !==
    M_contextual_filter_constants.contextualFilterLanguageMap[
      t.properties.languageId
    ]
  ) {
    b =
      M_contextual_filter_constants.contextualFilterLanguageMap[
        t.properties.languageId
      ];
  }
  let w = M_contextual_filter_constants.contextualFilterIntercept;
  w += M_contextual_filter_constants.contextualFilterWeights[0] * a;
  w += M_contextual_filter_constants.contextualFilterWeights[1] * c;
  w += M_contextual_filter_constants.contextualFilterWeights[2] * u;
  w += M_contextual_filter_constants.contextualFilterWeights[3] * d;
  w += M_contextual_filter_constants.contextualFilterWeights[4] * f;
  w += M_contextual_filter_constants.contextualFilterWeights[5] * _;
  w += M_contextual_filter_constants.contextualFilterWeights[6] * y;
  w += M_contextual_filter_constants.contextualFilterWeights[7] * v;
  w += M_contextual_filter_constants.contextualFilterWeights[8 + b];
  w += M_contextual_filter_constants.contextualFilterWeights[29 + p];
  w += M_contextual_filter_constants.contextualFilterWeights[125 + m];
  const x = 1 / (1 + Math.exp(-w));
  e.get(ContextualFilterManager).probabilityAccept = x;
  return x;
};
