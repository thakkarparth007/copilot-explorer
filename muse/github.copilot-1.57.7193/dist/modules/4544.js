const {
    constants: {
      MAX_LENGTH: r
    }
  } = require(4300),
  {
    pipeline: o,
    PassThrough: i
  } = require(2781),
  {
    promisify: s
  } = require(3837),
  {
    createGunzip: a,
    createInflate: c,
    createBrotliDecompress: l,
    constants: {
      Z_SYNC_FLUSH: u
    }
  } = require(9796),
  d = require(8104)("helix-fetch:utils"),
  p = s(o),
  h = (e, t) => {
    if (Buffer.isBuffer(e)) return e.length;
    switch (typeof e) {
      case "string":
        return 2 * e.length;
      case "boolean":
        return 4;
      case "number":
        return 8;
      case "symbol":
        return Symbol.keyFor(e) ? 2 * Symbol.keyFor(e).length : 2 * (e.toString().length - 8);
      case "object":
        return Array.isArray(e) ? f(e, t) : m(e, t);
      default:
        return 0;
    }
  },
  f = (e, t) => (t.add(e), e.map(e => t.has(e) ? 0 : h(e, t)).reduce((e, t) => e + t, 0)),
  m = (e, t) => {
    if (null == e) return 0;
    t.add(e);
    let n = 0;
    const r = [];
    for (const t in e) r.push(t);
    r.push(...Object.getOwnPropertySymbols(e));
    r.forEach(r => {
      n += h(r, t);
      if ("object" == typeof e[r] && null !== e[r]) {
        if (t.has(e[r])) return;
        t.add(e[r]);
      }
      n += h(e[r], t);
    });
    return n;
  };
module.exports = {
  decodeStream: (e, t, n, r) => {
    if (!((e, t) => 204 !== e && 304 !== e && 0 != +t["content-length"] && /^\s*(?:(x-)?deflate|(x-)?gzip|br)\s*$/.test(t["content-encoding"]))(e, t)) return n;
    const i = e => {
      e && (d(`encountered error while decoding stream: ${e}`), r(e));
    };
    switch (t["content-encoding"].trim()) {
      case "gzip":
      case "x-gzip":
        return o(n, a({
          flush: u,
          finishFlush: u
        }), i);
      case "deflate":
      case "x-deflate":
        return o(n, c(), i);
      case "br":
        return o(n, l(), i);
      default:
        return n;
    }
  },
  isPlainObject: e => {
    if (!e || "object" != typeof e) return !1;
    if ("[object Object]" !== Object.prototype.toString.call(e)) return !1;
    if (null === Object.getPrototypeOf(e)) return !0;
    let t = e;
    for (; null !== Object.getPrototypeOf(t);) t = Object.getPrototypeOf(t);
    return Object.getPrototypeOf(e) === t;
  },
  sizeof: e => h(e, new WeakSet()),
  streamToBuffer: async e => {
    const t = new i();
    let n = 0;
    const o = [];
    t.on("data", e => {
      if (n + e.length > r) throw new Error("Buffer.constants.MAX_SIZE exceeded");
      o.push(e);
      n += e.length;
    });
    await p(e, t);
    return Buffer.concat(o, n);
  }
};