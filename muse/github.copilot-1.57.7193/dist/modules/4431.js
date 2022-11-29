Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.findEditDistanceScore = undefined;
const r = require(9852);
exports.findEditDistanceScore = function (e, t) {
  if ("string" == typeof e) {
    e = r.tokenize(e);
  }
  if ("string" == typeof t) {
    t = r.tokenize(t);
  }
  if (0 === e.length || 0 === t.length)
    return {
      score: e.length + t.length,
    };
  const n = Array.from({
    length: e.length,
  }).map(() =>
    Array.from({
      length: t.length,
    }).map(() => 0)
  );
  for (let t = 0; t < e.length; t++) n[t][0] = t;
  for (let e = 0; e < t.length; e++) n[0][e] = e;
  for (let r = 0; r < t.length; r++)
    for (let o = 0; o < e.length; o++)
      n[o][r] = Math.min(
        (0 == o ? r : n[o - 1][r]) + 1,
        (0 == r ? o : n[o][r - 1]) + 1,
        (0 == o || 0 == r ? Math.max(o, r) : n[o - 1][r - 1]) +
          (e[o] == t[r] ? 0 : 1)
      );
  return {
    score: n[e.length - 1][t.length - 1],
  };
};
