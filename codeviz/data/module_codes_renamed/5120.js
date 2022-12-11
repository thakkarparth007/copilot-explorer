function editDistance(e, t, n = (e, t) => (e === t ? 0 : 1)) {
  if (0 === t.length || 0 === e.length)
    return {
      distance: t.length,
      startOffset: 0,
      endOffset: 0,
    };
  let r = new Array(t.length + 1).fill(0);
  let o = new Array(t.length + 1).fill(0);
  let i = new Array(e.length + 1).fill(0);
  let s = new Array(e.length + 1).fill(0);
  let a = t[0];
  for (let t = 0; t < e.length + 1; t++) {
    r[t] = 0 === t ? 1 : n(e[t - 1], a, t - 1, 0);
    o[t] = t > 0 ? t - 1 : 0;
  }
  for (let c = 1; c < t.length; c++) {
    let l = i;
    i = r;
    r = l;
    l = s;
    s = o;
    o = l;
    a = t[c];
    r[0] = c + 1;
    for (let t = 1; t < e.length + 1; t++) {
      const l = 1 + i[t];
      const u = 1 + r[t - 1];
      const d = n(e[t - 1], a, t - 1, c) + i[t - 1];
      r[t] = Math.min(u, l, d);
      if (r[t] === d) {
        o[t] = s[t - 1];
      } else {
        if (r[t] === l) {
          o[t] = s[t];
        } else {
          o[t] = o[t - 1];
        }
      }
    }
  }
  let c = 0;
  for (let t = 0; t < e.length + 1; t++)
    if (r[t] < r[c]) {
      c = t;
    }
  return {
    distance: r[c],
    startOffset: o[c],
    endOffset: c,
  };
}
function emptyLexDictionary() {
  return new Map();
}
function reverseLexDictionary(e) {
  const t = new Array(e.size);
  for (const [n, r] of e) t[r] = n;
  return t;
}
function* lexGeneratorWords(e) {
  let t;
  let n = "";
  !(function (e) {
    e[(e.Word = 0)] = "Word";
    e[(e.Space = 1)] = "Space";
    e[(e.Other = 2)] = "Other";
  })(t || (t = {}));
  let r = t.Word;
  for (const o of e) {
    let e;
    e = /(\p{L}|\p{Nd}|_)/u.test(o) ? t.Word : " " === o ? t.Space : t.Other;
    if (e === r && e !== t.Other) {
      n += o;
    } else {
      if (n.length > 0) {
        yield n;
      }
      n = o;
      r = e;
    }
  }
  if (n.length > 0) {
    yield n;
  }
}
function lexicalAnalyzer(e, t, n, r) {
  const o = [];
  let i = 0;
  for (const s of n(e)) {
    if (r(s)) {
      if (t.has(s)) {
        t.set(s, t.size);
      }
      o.push([t.get(s), i]);
    }
    i += s.length;
  }
  return [o, t];
}
function a(e) {
  return " " !== e;
}
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.lexEditDistance =
  exports.lexicalAnalyzer =
  exports.lexGeneratorWords =
  exports.reverseLexDictionary =
  exports.emptyLexDictionary =
  exports.editDistance =
    undefined;
exports.editDistance = editDistance;
exports.emptyLexDictionary = emptyLexDictionary;
exports.reverseLexDictionary = reverseLexDictionary;
exports.lexGeneratorWords = lexGeneratorWords;
exports.lexicalAnalyzer = lexicalAnalyzer;
exports.lexEditDistance = function (e, t, c = lexGeneratorWords) {
  const [l, u] = lexicalAnalyzer(e, emptyLexDictionary(), c, a);
  const [d, p] = lexicalAnalyzer(t, u, c, a);
  if (0 === d.length || 0 === l.length)
    return {
      lexDistance: d.length,
      startOffset: 0,
      endOffset: 0,
      haystackLexLength: l.length,
      needleLexLength: d.length,
    };
  const h = reverseLexDictionary(p);
  const f = d.length;
  const m = h[d[0][0]];
  const g = h[d[f - 1][0]];
  const _ = editDistance(
    l.map((e) => e[0]),
    d.map((e) => e[0]),
    function (e, t, n, r) {
      if (0 === r || r === f - 1) {
        const e = h[l[n][0]];
        return (0 == r && e.endsWith(m)) || (r == f - 1 && e.startsWith(g))
          ? 0
          : 1;
      }
      return e === t ? 0 : 1;
    }
  );
  const y = l[_.startOffset][1];
  let v = _.endOffset < l.length ? l[_.endOffset][1] : e.length;
  if (v > 0 && " " === e[v - 1]) {
    --v;
  }
  return {
    lexDistance: _.distance,
    startOffset: y,
    endOffset: v,
    haystackLexLength: l.length,
    needleLexLength: d.length,
  };
};
