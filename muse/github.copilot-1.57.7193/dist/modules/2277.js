require.r(exports);
require.d(exports, {
  NIL: () => x,
  parse: () => _,
  stringify: () => d,
  v1: () => g,
  v3: () => v,
  v4: () => b,
  v5: () => w,
  validate: () => l,
  version: () => E
});
var r = require(6113),
  o = require.n(r);
const i = new Uint8Array(256);
let s = i.length;
function a() {
  s > i.length - 16 && (o().randomFillSync(i), s = 0);
  return i.slice(s, s += 16);
}
const c = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,
  l = function (e) {
    return "string" == typeof e && c.test(e);
  },
  u = [];
for (let e = 0; e < 256; ++e) u.push((e + 256).toString(16).substr(1));
const d = function (e, t = 0) {
  const n = (u[e[t + 0]] + u[e[t + 1]] + u[e[t + 2]] + u[e[t + 3]] + "-" + u[e[t + 4]] + u[e[t + 5]] + "-" + u[e[t + 6]] + u[e[t + 7]] + "-" + u[e[t + 8]] + u[e[t + 9]] + "-" + u[e[t + 10]] + u[e[t + 11]] + u[e[t + 12]] + u[e[t + 13]] + u[e[t + 14]] + u[e[t + 15]]).toLowerCase();
  if (!l(n)) throw TypeError("Stringified UUID is invalid");
  return n;
};
let p,
  h,
  f = 0,
  m = 0;
const g = function (e, t, n) {
    let r = t && n || 0;
    const o = t || new Array(16);
    let i = (e = e || {}).node || p,
      s = undefined !== e.clockseq ? e.clockseq : h;
    if (null == i || null == s) {
      const t = e.random || (e.rng || a)();
      null == i && (i = p = [1 | t[0], t[1], t[2], t[3], t[4], t[5]]);
      null == s && (s = h = 16383 & (t[6] << 8 | t[7]));
    }
    let c = undefined !== e.msecs ? e.msecs : Date.now(),
      l = undefined !== e.nsecs ? e.nsecs : m + 1;
    const u = c - f + (l - m) / 1e4;
    u < 0 && undefined === e.clockseq && (s = s + 1 & 16383);
    (u < 0 || c > f) && undefined === e.nsecs && (l = 0);
    if (l >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    f = c;
    m = l;
    h = s;
    c += 122192928e5;
    const g = (1e4 * (268435455 & c) + l) % 4294967296;
    o[r++] = g >>> 24 & 255;
    o[r++] = g >>> 16 & 255;
    o[r++] = g >>> 8 & 255;
    o[r++] = 255 & g;
    const _ = c / 4294967296 * 1e4 & 268435455;
    o[r++] = _ >>> 8 & 255;
    o[r++] = 255 & _;
    o[r++] = _ >>> 24 & 15 | 16;
    o[r++] = _ >>> 16 & 255;
    o[r++] = s >>> 8 | 128;
    o[r++] = 255 & s;
    for (let e = 0; e < 6; ++e) o[r + e] = i[e];
    return t || d(o);
  },
  _ = function (e) {
    if (!l(e)) throw TypeError("Invalid UUID");
    let t;
    const n = new Uint8Array(16);
    n[0] = (t = parseInt(e.slice(0, 8), 16)) >>> 24;
    n[1] = t >>> 16 & 255;
    n[2] = t >>> 8 & 255;
    n[3] = 255 & t;
    n[4] = (t = parseInt(e.slice(9, 13), 16)) >>> 8;
    n[5] = 255 & t;
    n[6] = (t = parseInt(e.slice(14, 18), 16)) >>> 8;
    n[7] = 255 & t;
    n[8] = (t = parseInt(e.slice(19, 23), 16)) >>> 8;
    n[9] = 255 & t;
    n[10] = (t = parseInt(e.slice(24, 36), 16)) / 1099511627776 & 255;
    n[11] = t / 4294967296 & 255;
    n[12] = t >>> 24 & 255;
    n[13] = t >>> 16 & 255;
    n[14] = t >>> 8 & 255;
    n[15] = 255 & t;
    return n;
  };
function y(e, t, n) {
  function r(e, r, o, i) {
    "string" == typeof e && (e = function (e) {
      e = unescape(encodeURIComponent(e));
      const t = [];
      for (let n = 0; n < e.length; ++n) t.push(e.charCodeAt(n));
      return t;
    }(e));
    "string" == typeof r && (r = _(r));
    if (16 !== r.length) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
    let s = new Uint8Array(16 + e.length);
    s.set(r);
    s.set(e, r.length);
    s = n(s);
    s[6] = 15 & s[6] | t;
    s[8] = 63 & s[8] | 128;
    if (o) {
      i = i || 0;
      for (let e = 0; e < 16; ++e) o[i + e] = s[e];
      return o;
    }
    return d(s);
  }
  try {
    r.name = e;
  } catch (e) {}
  r.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  r.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  return r;
}
const v = y("v3", 48, function (e) {
    Array.isArray(e) ? e = Buffer.from(e) : "string" == typeof e && (e = Buffer.from(e, "utf8"));
    return o().createHash("md5").update(e).digest();
  }),
  b = function (e, t, n) {
    const r = (e = e || {}).random || (e.rng || a)();
    r[6] = 15 & r[6] | 64;
    r[8] = 63 & r[8] | 128;
    if (t) {
      n = n || 0;
      for (let e = 0; e < 16; ++e) t[n + e] = r[e];
      return t;
    }
    return d(r);
  },
  w = y("v5", 80, function (e) {
    Array.isArray(e) ? e = Buffer.from(e) : "string" == typeof e && (e = Buffer.from(e, "utf8"));
    return o().createHash("sha1").update(e).digest();
  }),
  x = "00000000-0000-0000-0000-000000000000",
  E = function (e) {
    if (!l(e)) throw TypeError("Invalid UUID");
    return parseInt(e.substr(14, 1), 16);
  };