const r = require(3055_747),
  o = require(3055_622),
  i = (e, t) => Array.from(Array(t).keys()).slice(e),
  s = (e) => e.charCodeAt(0),
  a = new TextDecoder("utf-8"),
  c = (e) => a.decode(new Uint8Array(e));
function l(e) {
  const t = new Set();
  let n = e[0];
  for (let r = 1; r < e.length; r++) {
    const o = e[r];
    t.add([n, o]);
    n = o;
  }
  return t;
}
const u = new TextEncoder("utf-8"),
  d =
    /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
let p = !1;
const h = {};
let f,
  m = {},
  g = new Map(),
  _ = new Map();
const y = new Map();
function v() {
  if (p) return;
  m = JSON.parse(
    r.readFileSync(o.resolve(__dirname, "..", "dist", "tokenizer.json"))
  );
  Object.keys(m).map((e) => {
    h[m[e]] = e;
  });
  const e = r
      .readFileSync(o.resolve(__dirname, "..", "dist", "vocab.bpe"), "utf-8")
      .split("\n"),
    t = e.slice(1, e.length - 1).map((e) =>
      e.split(/(\s+)/).filter(function (e) {
        return e.trim().length > 0;
      })
    );
  f = ((e, t) => {
    const n = {};
    e.map((r, o) => {
      n[e[o]] = t[o];
    });
    return n;
  })(t, i(0, t.length));
  (function (e) {
    const t = i(s("!"), s("~") + 1).concat(
      i(s("¡"), s("¬") + 1),
      i(s("®"), s("ÿ") + 1)
    );
    let n = t.slice(),
      r = 0;
    for (let e = 0; e < 256; e++)
      if (t.includes(e)) {
        t.push(e);
        n.push(256 + r);
        r += 1;
      }
    n = n.map((e) => ((e) => String.fromCharCode(e))(e));
    for (let r = 0; r < t.length; r++) e.set(t[r], n[r]);
  })(g);
  g.forEach(function (e, t, n) {
    _.set(e, t);
  });
  p = !0;
}
function b(e) {
  if (y.has(e)) return y.get(e);
  let t = ((r = e), Array.from(u.encode(r))).map((e) => g.get(e)),
    n = l(t);
  var r;
  if (!n) return t.map((e) => m[e]);
  for (;;) {
    const e = {};
    Array.from(n).map((t) => {
      const n = f[t];
      e[isNaN(n) ? 1e11 : n] = t;
    });
    const r = e[Math.min(...Object.keys(e).map((e) => parseInt(e)))];
    if (!(r in f)) break;
    const o = r[0],
      i = r[1];
    let s = [],
      a = 0;
    for (; a < t.length; ) {
      const e = t.indexOf(o, a);
      if (-1 === e) {
        Array.prototype.push.apply(s, t.slice(a));
        break;
      }
      Array.prototype.push.apply(s, t.slice(a, e));
      a = e;
      if (t[a] === o && a < t.length - 1 && t[a + 1] === i) {
        s.push(o + i);
        a += 2;
      } else {
        s.push(t[a]);
        a += 1;
      }
    }
    t = s;
    if (1 === t.length) break;
    n = l(t);
  }
  tokens = t.map((e) => m[e]);
  y.set(e, tokens);
  return tokens;
}
function w(e) {
  v();
  let t = [];
  const n = Array.from(e.matchAll(d)).map((e) => e[0]);
  for (let e of n) {
    const n = b(e);
    Array.prototype.push.apply(t, n);
  }
  return t;
}
function x(e, t) {
  if (t <= 0) return "";
  let n = Math.min(e.length, 4 * t),
    r = e.slice(-n),
    o = w(r);
  for (; o.length < t + 2 && n < e.length; ) {
    n = Math.min(e.length, n + 1 * t);
    r = e.slice(-n);
    o = w(r);
  }
  return o.length < t ? e : ((o = o.slice(-t)), E(o));
}
function E(e) {
  v();
  let t = e.map((e) => h[e]).join("");
  t = c(t.split("").map((e) => _.get(e)));
  return t;
}
module.exports = {
  prepareTokenizer: v,
  tokenize: w,
  tokenize_strings: function (e) {
    return w(e).map((e) => c(h[e].split("").map((e) => _.get(e))));
  },
  tokenLength: function (e) {
    return w(e).length;
  },
  takeLastTokens: x,
  takeLastLinesTokens: function (e, t) {
    const n = x(e, t);
    if (n.length === e.length || "\n" === e[e.length - n.length - 1]) return n;
    let r = n.indexOf("\n");
    return n.substring(r + 1);
  },
  takeFirstTokens: function (e, t) {
    if (t <= 0)
      return {
        text: "",
        tokens: [],
      };
    let n = Math.min(e.length, 4 * t),
      r = e.slice(0, n),
      o = w(r);
    for (; o.length < t + 2 && n < e.length; ) {
      n = Math.min(e.length, n + 1 * t);
      r = e.slice(0, n);
      o = w(r);
    }
    return o.length < t
      ? {
          text: e,
          tokens: o,
        }
      : ((o = o.slice(0, t)),
        {
          text: E(o),
          tokens: o,
        });
  },
  detokenize: E,
};