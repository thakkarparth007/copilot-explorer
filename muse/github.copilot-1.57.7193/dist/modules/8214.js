var r;
r = require(8249);
(function (e) {
  var t = r,
    n = t.lib,
    o = n.WordArray,
    i = n.Hasher,
    s = t.algo,
    a = [];
  !function () {
    for (var t = 0; t < 64; t++) a[t] = 4294967296 * e.abs(e.sin(t + 1)) | 0;
  }();
  var c = s.MD5 = i.extend({
    _doReset: function () {
      this._hash = new o.init([1732584193, 4023233417, 2562383102, 271733878]);
    },
    _doProcessBlock: function (e, t) {
      for (var n = 0; n < 16; n++) {
        var r = t + n,
          o = e[r];
        e[r] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8);
      }
      var i = this._hash.words,
        s = e[t + 0],
        c = e[t + 1],
        h = e[t + 2],
        f = e[t + 3],
        m = e[t + 4],
        g = e[t + 5],
        _ = e[t + 6],
        y = e[t + 7],
        v = e[t + 8],
        b = e[t + 9],
        w = e[t + 10],
        x = e[t + 11],
        E = e[t + 12],
        C = e[t + 13],
        S = e[t + 14],
        T = e[t + 15],
        k = i[0],
        I = i[1],
        P = i[2],
        A = i[3];
      k = l(k, I, P, A, s, 7, a[0]);
      A = l(A, k, I, P, c, 12, a[1]);
      P = l(P, A, k, I, h, 17, a[2]);
      I = l(I, P, A, k, f, 22, a[3]);
      k = l(k, I, P, A, m, 7, a[4]);
      A = l(A, k, I, P, g, 12, a[5]);
      P = l(P, A, k, I, _, 17, a[6]);
      I = l(I, P, A, k, y, 22, a[7]);
      k = l(k, I, P, A, v, 7, a[8]);
      A = l(A, k, I, P, b, 12, a[9]);
      P = l(P, A, k, I, w, 17, a[10]);
      I = l(I, P, A, k, x, 22, a[11]);
      k = l(k, I, P, A, E, 7, a[12]);
      A = l(A, k, I, P, C, 12, a[13]);
      P = l(P, A, k, I, S, 17, a[14]);
      k = u(k, I = l(I, P, A, k, T, 22, a[15]), P, A, c, 5, a[16]);
      A = u(A, k, I, P, _, 9, a[17]);
      P = u(P, A, k, I, x, 14, a[18]);
      I = u(I, P, A, k, s, 20, a[19]);
      k = u(k, I, P, A, g, 5, a[20]);
      A = u(A, k, I, P, w, 9, a[21]);
      P = u(P, A, k, I, T, 14, a[22]);
      I = u(I, P, A, k, m, 20, a[23]);
      k = u(k, I, P, A, b, 5, a[24]);
      A = u(A, k, I, P, S, 9, a[25]);
      P = u(P, A, k, I, f, 14, a[26]);
      I = u(I, P, A, k, v, 20, a[27]);
      k = u(k, I, P, A, C, 5, a[28]);
      A = u(A, k, I, P, h, 9, a[29]);
      P = u(P, A, k, I, y, 14, a[30]);
      k = d(k, I = u(I, P, A, k, E, 20, a[31]), P, A, g, 4, a[32]);
      A = d(A, k, I, P, v, 11, a[33]);
      P = d(P, A, k, I, x, 16, a[34]);
      I = d(I, P, A, k, S, 23, a[35]);
      k = d(k, I, P, A, c, 4, a[36]);
      A = d(A, k, I, P, m, 11, a[37]);
      P = d(P, A, k, I, y, 16, a[38]);
      I = d(I, P, A, k, w, 23, a[39]);
      k = d(k, I, P, A, C, 4, a[40]);
      A = d(A, k, I, P, s, 11, a[41]);
      P = d(P, A, k, I, f, 16, a[42]);
      I = d(I, P, A, k, _, 23, a[43]);
      k = d(k, I, P, A, b, 4, a[44]);
      A = d(A, k, I, P, E, 11, a[45]);
      P = d(P, A, k, I, T, 16, a[46]);
      k = p(k, I = d(I, P, A, k, h, 23, a[47]), P, A, s, 6, a[48]);
      A = p(A, k, I, P, y, 10, a[49]);
      P = p(P, A, k, I, S, 15, a[50]);
      I = p(I, P, A, k, g, 21, a[51]);
      k = p(k, I, P, A, E, 6, a[52]);
      A = p(A, k, I, P, f, 10, a[53]);
      P = p(P, A, k, I, w, 15, a[54]);
      I = p(I, P, A, k, c, 21, a[55]);
      k = p(k, I, P, A, v, 6, a[56]);
      A = p(A, k, I, P, T, 10, a[57]);
      P = p(P, A, k, I, _, 15, a[58]);
      I = p(I, P, A, k, C, 21, a[59]);
      k = p(k, I, P, A, m, 6, a[60]);
      A = p(A, k, I, P, x, 10, a[61]);
      P = p(P, A, k, I, h, 15, a[62]);
      I = p(I, P, A, k, b, 21, a[63]);
      i[0] = i[0] + k | 0;
      i[1] = i[1] + I | 0;
      i[2] = i[2] + P | 0;
      i[3] = i[3] + A | 0;
    },
    _doFinalize: function () {
      var t = this._data,
        n = t.words,
        r = 8 * this._nDataBytes,
        o = 8 * t.sigBytes;
      n[o >>> 5] |= 128 << 24 - o % 32;
      var i = e.floor(r / 4294967296),
        s = r;
      n[15 + (o + 64 >>> 9 << 4)] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
      n[14 + (o + 64 >>> 9 << 4)] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);
      t.sigBytes = 4 * (n.length + 1);
      this._process();
      for (var a = this._hash, c = a.words, l = 0; l < 4; l++) {
        var u = c[l];
        c[l] = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8);
      }
      return a;
    },
    clone: function () {
      var e = i.clone.call(this);
      e._hash = this._hash.clone();
      return e;
    }
  });
  function l(e, t, n, r, o, i, s) {
    var a = e + (t & n | ~t & r) + o + s;
    return (a << i | a >>> 32 - i) + t;
  }
  function u(e, t, n, r, o, i, s) {
    var a = e + (t & r | n & ~r) + o + s;
    return (a << i | a >>> 32 - i) + t;
  }
  function d(e, t, n, r, o, i, s) {
    var a = e + (t ^ n ^ r) + o + s;
    return (a << i | a >>> 32 - i) + t;
  }
  function p(e, t, n, r, o, i, s) {
    var a = e + (n ^ (t | ~r)) + o + s;
    return (a << i | a >>> 32 - i) + t;
  }
  t.MD5 = i._createHelper(c);
  t.HmacMD5 = i._createHmacHelper(c);
})(Math);
module.exports = r.MD5;