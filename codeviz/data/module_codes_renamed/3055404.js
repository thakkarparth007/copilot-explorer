Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.computeScore =
  exports.IndentationBasedJaccardMatcher =
  exports.FixedWindowSizeJaccardMatcher =
    undefined;
const M_window_delineator = require("window-delineator");
const M_window_matcher = require("window-matcher");
class FixedWindowSizeJaccardMatcher extends M_window_matcher.WindowedMatcher {
  constructor(e, t) {
    super(e);
    this.windowLength = t;
  }
  id() {
    return "fixed:" + this.windowLength;
  }
  getWindowsDelineations(e) {
    const t = [];
    const n = e.length;
    for (let e = 0; 0 == e || e < n - this.windowLength; e++) {
      const r = Math.min(e + this.windowLength, n);
      t.push([e, r]);
    }
    return t;
  }
  trimDocument(e) {
    return e.source
      .slice(0, e.offset)
      .split("\n")
      .slice(-this.windowLength)
      .join("\n");
  }
  similarityScore(e, t) {
    return computeScore(e, t);
  }
}
exports.FixedWindowSizeJaccardMatcher = FixedWindowSizeJaccardMatcher;
FixedWindowSizeJaccardMatcher.FACTORY = (e) => ({
  to: (t) => new FixedWindowSizeJaccardMatcher(t, e),
});
class IndentationBasedJaccardMatcher extends M_window_matcher.WindowedMatcher {
  constructor(e, t, n) {
    super(e);
    this.indentationMinLength = t;
    this.indentationMaxLength = n;
    this.languageId = e.languageId;
  }
  id() {
    return `indent:${this.indentationMinLength}:${this.indentationMaxLength}:${this.languageId}`;
  }
  getWindowsDelineations(e) {
    return M_window_delineator.getWindowsDelineations(
      e,
      this.languageId,
      this.indentationMinLength,
      this.indentationMaxLength
    );
  }
  trimDocument(e) {
    return e.source
      .slice(0, e.offset)
      .split("\n")
      .slice(-this.indentationMaxLength)
      .join("\n");
  }
  similarityScore(e, t) {
    return computeScore(e, t);
  }
}
function computeScore(e, t) {
  const n = new Set();
  e.forEach((e) => {
    if (t.has(e)) {
      n.add(e);
    }
  });
  return n.size / (e.size + t.size - n.size);
}
exports.IndentationBasedJaccardMatcher = IndentationBasedJaccardMatcher;
IndentationBasedJaccardMatcher.FACTORY = (e, t) => ({
  to: (n) => new IndentationBasedJaccardMatcher(n, e, t),
});
exports.computeScore = computeScore;
