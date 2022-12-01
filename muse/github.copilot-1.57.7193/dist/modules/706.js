var r;
r = require(8249);
(function (e) {
  var t = r,
    n = t.lib,
    o = n.WordArray,
    i = n.Hasher,
    s = t.algo,
    a = o.create([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6,
      15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6,
      13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0,
      5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
    ]),
    c = o.create([
      5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13,
      5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2,
      10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12,
      15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
    ]),
    l = o.create([
      11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11,
      9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8,
      13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5,
      12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
    ]),
    u = o.create([
      8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12,
      8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13,
      5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15,
      8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
    ]),
    d = o.create([0, 1518500249, 1859775393, 2400959708, 2840853838]),
    p = o.create([1352829926, 1548603684, 1836072691, 2053994217, 0]),
    h = (s.RIPEMD160 = i.extend({
      _doReset: function () {
        this._hash = o.create([
          1732584193, 4023233417, 2562383102, 271733878, 3285377520,
        ]);
      },
      _doProcessBlock: function (e, t) {
        for (var n = 0; n < 16; n++) {
          var r = t + n,
            o = e[r];
          e[r] =
            (16711935 & ((o << 8) | (o >>> 24))) |
            (4278255360 & ((o << 24) | (o >>> 8)));
        }
        var i,
          s,
          h,
          b,
          w,
          x,
          E,
          C,
          S,
          T,
          k,
          I = this._hash.words,
          P = d.words,
          A = p.words,
          O = a.words,
          N = c.words,
          R = l.words,
          M = u.words;
        for (
          x = i = I[0],
            E = s = I[1],
            C = h = I[2],
            S = b = I[3],
            T = w = I[4],
            n = 0;
          n < 80;
          n += 1
        ) {
          k = (i + e[t + O[n]]) | 0;
          k +=
            n < 16
              ? f(s, h, b) + P[0]
              : n < 32
              ? m(s, h, b) + P[1]
              : n < 48
              ? g(s, h, b) + P[2]
              : n < 64
              ? _(s, h, b) + P[3]
              : y(s, h, b) + P[4];
          k = ((k = v((k |= 0), R[n])) + w) | 0;
          i = w;
          w = b;
          b = v(h, 10);
          h = s;
          s = k;
          k = (x + e[t + N[n]]) | 0;
          k +=
            n < 16
              ? y(E, C, S) + A[0]
              : n < 32
              ? _(E, C, S) + A[1]
              : n < 48
              ? g(E, C, S) + A[2]
              : n < 64
              ? m(E, C, S) + A[3]
              : f(E, C, S) + A[4];
          k = ((k = v((k |= 0), M[n])) + T) | 0;
          x = T;
          T = S;
          S = v(C, 10);
          C = E;
          E = k;
        }
        k = (I[1] + h + S) | 0;
        I[1] = (I[2] + b + T) | 0;
        I[2] = (I[3] + w + x) | 0;
        I[3] = (I[4] + i + E) | 0;
        I[4] = (I[0] + s + C) | 0;
        I[0] = k;
      },
      _doFinalize: function () {
        var e = this._data,
          t = e.words,
          n = 8 * this._nDataBytes,
          r = 8 * e.sigBytes;
        t[r >>> 5] |= 128 << (24 - (r % 32));
        t[14 + (((r + 64) >>> 9) << 4)] =
          (16711935 & ((n << 8) | (n >>> 24))) |
          (4278255360 & ((n << 24) | (n >>> 8)));
        e.sigBytes = 4 * (t.length + 1);
        this._process();
        for (var o = this._hash, i = o.words, s = 0; s < 5; s++) {
          var a = i[s];
          i[s] =
            (16711935 & ((a << 8) | (a >>> 24))) |
            (4278255360 & ((a << 24) | (a >>> 8)));
        }
        return o;
      },
      clone: function () {
        var e = i.clone.call(this);
        e._hash = this._hash.clone();
        return e;
      },
    }));
  function f(e, t, n) {
    return e ^ t ^ n;
  }
  function m(e, t, n) {
    return (e & t) | (~e & n);
  }
  function g(e, t, n) {
    return (e | ~t) ^ n;
  }
  function _(e, t, n) {
    return (e & n) | (t & ~n);
  }
  function y(e, t, n) {
    return e ^ (t | ~n);
  }
  function v(e, t) {
    return (e << t) | (e >>> (32 - t));
  }
  t.RIPEMD160 = i._createHelper(h);
  t.HmacRIPEMD160 = i._createHmacHelper(h);
})(Math);
module.exports = r.RIPEMD160;