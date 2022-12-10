Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ghostTextScoreQuantile = exports.ghostTextScoreConfidence = undefined;
const M_logging_utils = require("logging-utils"),
  M_ghost_text_display_constants_NOTSURE = require("ghost-text-display-constants"),
  i =
    (new M_logging_utils.Logger(M_logging_utils.LogLevel.INFO, "restraint"),
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
      const n = Math.min(...Array.from(t.keys()).filter((t) => t >= e)),
        r = Math.max(...Array.from(t.keys()).filter((t) => t < e)),
        o = t.get(n),
        i = t.get(r);
      return i + ((o - i) * (e - r)) / (n - r);
    })(this.predict(e, t), this.logitsToQuantiles);
  }
})(
  M_ghost_text_display_constants_NOTSURE.ghostTextDisplayInterceptParameter,
  [
    new s(
      "compCharLen",
      M_ghost_text_display_constants_NOTSURE.ghostTextDisplayLog1pcompCharLenParameter,
      (e) => Math.log(1 + e)
    ),
    new s(
      "meanLogProb",
      M_ghost_text_display_constants_NOTSURE.ghostTextDisplayMeanLogProbParameter
    ),
    new s(
      "meanAlternativeLogProb",
      M_ghost_text_display_constants_NOTSURE.ghostTextDisplayMeanAlternativeLogProbParameter
    ),
  ].concat(
    Object.entries(
      M_ghost_text_display_constants_NOTSURE.ghostTextDisplayLanguageParameters
    ).map((e) => new s(e[0], e[1]))
  ),
  M_ghost_text_display_constants_NOTSURE.ghostTextDisplayQuantiles
);
exports.ghostTextScoreConfidence = function (e, t) {
  const n = {
    ...t.measurements,
  };
  Object.keys(
    M_ghost_text_display_constants_NOTSURE.ghostTextDisplayLanguageParameters
  ).forEach((e) => {
    n[e] = t.properties["customDimensions.languageId"] == e ? 1 : 0;
  });
  return a.predict(e, n);
};
exports.ghostTextScoreQuantile = function (e, t) {
  const n = {
    ...t.measurements,
  };
  Object.keys(
    M_ghost_text_display_constants_NOTSURE.ghostTextDisplayLanguageParameters
  ).forEach((e) => {
    n[e] = t.properties["customDimensions.languageId"] == e ? 1 : 0;
  });
  return a.quantile(e, n);
};
