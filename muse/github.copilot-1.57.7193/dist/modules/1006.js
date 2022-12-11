Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ghostTextScoreQuantile = exports.ghostTextScoreConfidence = undefined;
const r = require(9899);
const o = require(7481);
const i =
  (new r.Logger(r.LogLevel.INFO, "restraint"),
  {
    link: (e) => Math.exp(e) / (1 + Math.exp(e)),
    unlink: (e) => Math.log(e / (1 - e)),
  });
class s {
  constructor(e, t, n) {
    this.name = e;
    this.coefficient = t;
    this.transformation = n || ((e) => e);
  }
  contribution(e) {
    return this.coefficient * this.transformation(e);
  }
}
const a = new (class {
  constructor(e, t, n) {
    this.link = i;
    this.intercept = e;
    this.coefficients = t;
    this.logitsToQuantiles = new Map();
    this.logitsToQuantiles.set(0, 0);
    this.logitsToQuantiles.set(1, 1);
    if (n) for (const e in n) this.logitsToQuantiles.set(n[e], Number(e));
  }
  predict(e, t) {
    let n = this.intercept;
    for (const e of this.coefficients) {
      const r = t[e.name];
      if (undefined === r) return NaN;
      n += e.contribution(r);
    }
    return this.link.link(n);
  }
  quantile(e, t) {
    return (function (e, t) {
      const n = Math.min(...Array.from(t.keys()).filter((t) => t >= e));
      const r = Math.max(...Array.from(t.keys()).filter((t) => t < e));
      const o = t.get(n);
      const i = t.get(r);
      return i + ((o - i) * (e - r)) / (n - r);
    })(this.predict(e, t), this.logitsToQuantiles);
  }
})(
  o.ghostTextDisplayInterceptParameter,
  [
    new s("compCharLen", o.ghostTextDisplayLog1pcompCharLenParameter, (e) =>
      Math.log(1 + e)
    ),
    new s("meanLogProb", o.ghostTextDisplayMeanLogProbParameter),
    new s(
      "meanAlternativeLogProb",
      o.ghostTextDisplayMeanAlternativeLogProbParameter
    ),
  ].concat(
    Object.entries(o.ghostTextDisplayLanguageParameters).map(
      (e) => new s(e[0], e[1])
    )
  ),
  o.ghostTextDisplayQuantiles
);
exports.ghostTextScoreConfidence = function (e, t) {
  const n = {
    ...t.measurements,
  };
  Object.keys(o.ghostTextDisplayLanguageParameters).forEach((e) => {
    n[e] = t.properties["customDimensions.languageId"] == e ? 1 : 0;
  });
  return a.predict(e, n);
};
exports.ghostTextScoreQuantile = function (e, t) {
  const n = {
    ...t.measurements,
  };
  Object.keys(o.ghostTextDisplayLanguageParameters).forEach((e) => {
    n[e] = t.properties["customDimensions.languageId"] == e ? 1 : 0;
  });
  return a.quantile(e, n);
};