Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.computeScore = exports.IndentationBasedJaccardMatcher = exports.FixedWindowSizeJaccardMatcher = undefined;
const r = require(4855),
  o = require(1016);
class i extends o.WindowedMatcher {
  constructor(e, t) {
    super(e);
    this.windowLength = t;
  }
  id() {
    return "fixed:" + this.windowLength;
  }
  getWindowsDelineations(e) {
    const t = [],
      n = e.length;
    for (let e = 0; 0 == e || e < n - this.windowLength; e++) {
      const r = Math.min(e + this.windowLength, n);
      t.push([e, r]);
    }
    return t;
  }
  trimDocument(e) {
    return e.source.slice(0, e.offset).split("\n").slice(-this.windowLength).join("\n");
  }
  similarityScore(e, t) {
    return a(e, t);
  }
}
exports.FixedWindowSizeJaccardMatcher = i;
i.FACTORY = e => ({
  to: t => new i(t, e)
});
class s extends o.WindowedMatcher {
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
    return r.getWindowsDelineations(e, this.languageId, this.indentationMinLength, this.indentationMaxLength);
  }
  trimDocument(e) {
    return e.source.slice(0, e.offset).split("\n").slice(-this.indentationMaxLength).join("\n");
  }
  similarityScore(e, t) {
    return a(e, t);
  }
}
function a(e, t) {
  const n = new Set();
  e.forEach(e => {
    t.has(e) && n.add(e);
  });
  return n.size / (e.size + t.size - n.size);
}
exports.IndentationBasedJaccardMatcher = s;
s.FACTORY = (e, t) => ({
  to: n => new s(n, e, t)
});
exports.computeScore = a;