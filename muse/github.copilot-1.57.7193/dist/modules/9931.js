Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getNeighborSnippets = exports.neighborOptionToSelection = undefined;
const r = require(1788),
  o = require(569);
function i(e) {
  return [
    e.relativePath
      ? "Compare this snippet from " + e.relativePath + ":"
      : "Compare this snippet:",
  ].concat(e.snippet.split("\n"));
}
exports.neighborOptionToSelection = {
  none: {
    matcherFactory: o.FixedWindowSizeJaccardMatcher.FACTORY(1),
    threshold: -1,
    numberOfSnippets: 0,
  },
  conservative: {
    matcherFactory: o.FixedWindowSizeJaccardMatcher.FACTORY(10),
    threshold: 0.3,
    numberOfSnippets: 1,
  },
  medium: {
    matcherFactory: o.FixedWindowSizeJaccardMatcher.FACTORY(20),
    threshold: 0.1,
    numberOfSnippets: 2,
  },
  eager: {
    matcherFactory: o.FixedWindowSizeJaccardMatcher.FACTORY(60),
    threshold: 0,
    numberOfSnippets: 4,
  },
  eagerButLittle: {
    matcherFactory: o.FixedWindowSizeJaccardMatcher.FACTORY(10),
    threshold: 0,
    numberOfSnippets: 1,
  },
};
exports.getNeighborSnippets = async function (e, n, s, a, c, l, u) {
  const d = exports.neighborOptionToSelection[s],
    p = (function (e, n, r, i) {
      const s = {
        ...exports.neighborOptionToSelection[n],
      };
      if (undefined !== r && undefined !== i) {
        s.matcherFactory = o.IndentationBasedJaccardMatcher.FACTORY(r, i);
      }
      return s.matcherFactory.to(e);
    })(e, s, a, c);
  return n
    .filter((e) => e.source.length < 1e4 && e.source.length > 0)
    .slice(0, 20)
    .reduce(
      (e, t) =>
        e.concat(
          p.findMatches(t, l, u).map((e) => ({
            relativePath: t.relativePath,
            ...e,
          }))
        ),
      []
    )
    .filter((e) => e.score && e.snippet && e.score > d.threshold)
    .sort((e, t) => e.score - t.score)
    .slice(-d.numberOfSnippets)
    .map((t) => ({
      score: t.score,
      snippet: i(t)
        .map((t) => r.comment(t, e.languageId) + "\n")
        .join(""),
      startLine: t.startLine,
      endLine: t.endLine,
    }));
};
