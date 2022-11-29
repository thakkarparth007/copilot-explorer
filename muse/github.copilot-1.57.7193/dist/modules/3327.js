var r;
r = require(8249);
require(4938);
(function (e) {
  var t = r,
    n = t.lib,
    o = n.WordArray,
    i = n.Hasher,
    s = t.x64.Word,
    a = t.algo,
    c = [],
    l = [],
    u = [];
  !function () {
    for (var e = 1, t = 0, n = 0; n < 24; n++) {
      c[e + 5 * t] = (n + 1) * (n + 2) / 2 % 64;
      var r = (2 * e + 3 * t) % 5;
      e = t % 5;
      t = r;
    }
    for (e = 0; e < 5; e++) for (t = 0; t < 5; t++) l[e + 5 * t] = t + (2 * e + 3 * t) % 5 * 5;
    for (var o = 1, i = 0; i < 24; i++) {
      for (var a = 0, d = 0, p = 0; p < 7; p++) {
        if (1 & o) {
          var h = (1 << p) - 1;
          h < 32 ? d ^= 1 << h : a ^= 1 << h - 32;
        }
        128 & o ? o = o << 1 ^ 113 : o <<= 1;
      }
      u[i] = s.create(a, d);
    }
  }();
  var d = [];
  !function () {
    for (var e = 0; e < 25; e++) d[e] = s.create();
  }();
  var p = a.SHA3 = i.extend({
    cfg: i.cfg.extend({
      outputLength: 512
    }),
    _doReset: function () {
      for (var e = this._state = [], t = 0; t < 25; t++) e[t] = new s.init();
      this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
    },
    _doProcessBlock: function (e, t) {
      for (var n = this._state, r = this.blockSize / 2, o = 0; o < r; o++) {
        var i = e[t + 2 * o],
          s = e[t + 2 * o + 1];
        i = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
        s = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);
        (I = n[o]).high ^= s;
        I.low ^= i;
      }
      for (var a = 0; a < 24; a++) {
        for (var p = 0; p < 5; p++) {
          for (var h = 0, f = 0, m = 0; m < 5; m++) {
            h ^= (I = n[p + 5 * m]).high;
            f ^= I.low;
          }
          var g = d[p];
          g.high = h;
          g.low = f;
        }
        for (p = 0; p < 5; p++) {
          var _ = d[(p + 4) % 5],
            y = d[(p + 1) % 5],
            v = y.high,
            b = y.low;
          for (h = _.high ^ (v << 1 | b >>> 31), f = _.low ^ (b << 1 | v >>> 31), m = 0; m < 5; m++) {
            (I = n[p + 5 * m]).high ^= h;
            I.low ^= f;
          }
        }
        for (var w = 1; w < 25; w++) {
          var x = (I = n[w]).high,
            E = I.low,
            C = c[w];
          C < 32 ? (h = x << C | E >>> 32 - C, f = E << C | x >>> 32 - C) : (h = E << C - 32 | x >>> 64 - C, f = x << C - 32 | E >>> 64 - C);
          var S = d[l[w]];
          S.high = h;
          S.low = f;
        }
        var T = d[0],
          k = n[0];
        for (T.high = k.high, T.low = k.low, p = 0; p < 5; p++) for (m = 0; m < 5; m++) {
          var I = n[w = p + 5 * m],
            P = d[w],
            A = d[(p + 1) % 5 + 5 * m],
            O = d[(p + 2) % 5 + 5 * m];
          I.high = P.high ^ ~A.high & O.high;
          I.low = P.low ^ ~A.low & O.low;
        }
        I = n[0];
        var N = u[a];
        I.high ^= N.high;
        I.low ^= N.low;
      }
    },
    _doFinalize: function () {
      var t = this._data,
        n = t.words,
        r = (this._nDataBytes, 8 * t.sigBytes),
        i = 32 * this.blockSize;
      n[r >>> 5] |= 1 << 24 - r % 32;
      n[(e.ceil((r + 1) / i) * i >>> 5) - 1] |= 128;
      t.sigBytes = 4 * n.length;
      this._process();
      for (var s = this._state, a = this.cfg.outputLength / 8, c = a / 8, l = [], u = 0; u < c; u++) {
        var d = s[u],
          p = d.high,
          h = d.low;
        p = 16711935 & (p << 8 | p >>> 24) | 4278255360 & (p << 24 | p >>> 8);
        h = 16711935 & (h << 8 | h >>> 24) | 4278255360 & (h << 24 | h >>> 8);
        l.push(h);
        l.push(p);
      }
      return new o.init(l, a);
    },
    clone: function () {
      for (var e = i.clone.call(this), t = e._state = this._state.slice(0), n = 0; n < 25; n++) t[n] = t[n].clone();
      return e;
    }
  });
  t.SHA3 = i._createHelper(p);
  t.HmacSHA3 = i._createHmacHelper(p);
})(Math);
module.exports = r.SHA3;