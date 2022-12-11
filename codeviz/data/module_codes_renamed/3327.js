var M_random_stuff_maybe;
M_random_stuff_maybe = require("random-stuff");
require("crypto-js-x64-core");
(function (e) {
  var t = M_random_stuff_maybe;
  var n = t.lib;
  var o = n.WordArray;
  var i = n.Hasher;
  var s = t.x64.Word;
  var a = t.algo;
  var c = [];
  var l = [];
  var u = [];
  !(function () {
    for (e = 1, t = 0, n = 0, undefined; n < 24; n++) {
      var e;
      var t;
      var n;
      c[e + 5 * t] = (((n + 1) * (n + 2)) / 2) % 64;
      var r = (2 * e + 3 * t) % 5;
      e = t % 5;
      t = r;
    }
    for (e = 0; e < 5; e++)
      for (t = 0; t < 5; t++) l[e + 5 * t] = t + ((2 * e + 3 * t) % 5) * 5;
    for (o = 1, i = 0, undefined; i < 24; i++) {
      var o;
      var i;
      for (a = 0, d = 0, p = 0, undefined; p < 7; p++) {
        var a;
        var d;
        var p;
        if (1 & o) {
          var h = (1 << p) - 1;
          if (h < 32) {
            d ^= 1 << h;
          } else {
            a ^= 1 << (h - 32);
          }
        }
        if (128 & o) {
          o = (o << 1) ^ 113;
        } else {
          o <<= 1;
        }
      }
      u[i] = s.create(a, d);
    }
  })();
  var d = [];
  !(function () {
    for (var e = 0; e < 25; e++) d[e] = s.create();
  })();
  var p = (a.SHA3 = i.extend({
    cfg: i.cfg.extend({
      outputLength: 512,
    }),
    _doReset: function () {
      for (e = this._state = [], t = 0, undefined; t < 25; t++) {
        var e;
        var t;
        e[t] = new s.init();
      }
      this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
    },
    _doProcessBlock: function (e, t) {
      for (
        n = this._state, r = this.blockSize / 2, o = 0, undefined;
        o < r;
        o++
      ) {
        var n;
        var r;
        var o;
        var i = e[t + 2 * o];
        var s = e[t + 2 * o + 1];
        i =
          (16711935 & ((i << 8) | (i >>> 24))) |
          (4278255360 & ((i << 24) | (i >>> 8)));
        s =
          (16711935 & ((s << 8) | (s >>> 24))) |
          (4278255360 & ((s << 24) | (s >>> 8)));
        (I = n[o]).high ^= s;
        I.low ^= i;
      }
      for (var a = 0; a < 24; a++) {
        for (var p = 0; p < 5; p++) {
          for (h = 0, f = 0, m = 0, undefined; m < 5; m++) {
            var h;
            var f;
            var m;
            h ^= (I = n[p + 5 * m]).high;
            f ^= I.low;
          }
          var g = d[p];
          g.high = h;
          g.low = f;
        }
        for (p = 0; p < 5; p++) {
          var _ = d[(p + 4) % 5];
          var y = d[(p + 1) % 5];
          var v = y.high;
          var b = y.low;
          for (
            h = _.high ^ ((v << 1) | (b >>> 31)),
              f = _.low ^ ((b << 1) | (v >>> 31)),
              m = 0;
            m < 5;
            m++
          ) {
            (I = n[p + 5 * m]).high ^= h;
            I.low ^= f;
          }
        }
        for (var w = 1; w < 25; w++) {
          var x = (I = n[w]).high;
          var E = I.low;
          var C = c[w];
          if (C < 32) {
            h = (x << C) | (E >>> (32 - C));
            f = (E << C) | (x >>> (32 - C));
          } else {
            h = (E << (C - 32)) | (x >>> (64 - C));
            f = (x << (C - 32)) | (E >>> (64 - C));
          }
          var S = d[l[w]];
          S.high = h;
          S.low = f;
        }
        var T = d[0];
        var k = n[0];
        for (T.high = k.high, T.low = k.low, p = 0; p < 5; p++)
          for (m = 0; m < 5; m++) {
            var I = n[(w = p + 5 * m)];
            var P = d[w];
            var A = d[((p + 1) % 5) + 5 * m];
            var O = d[((p + 2) % 5) + 5 * m];
            I.high = P.high ^ (~A.high & O.high);
            I.low = P.low ^ (~A.low & O.low);
          }
        I = n[0];
        var N = u[a];
        I.high ^= N.high;
        I.low ^= N.low;
      }
    },
    _doFinalize: function () {
      var t = this._data;
      var n = t.words;
      var r = (this._nDataBytes, 8 * t.sigBytes);
      var i = 32 * this.blockSize;
      n[r >>> 5] |= 1 << (24 - (r % 32));
      n[((e.ceil((r + 1) / i) * i) >>> 5) - 1] |= 128;
      t.sigBytes = 4 * n.length;
      this._process();
      for (
        s = this._state,
          a = this.cfg.outputLength / 8,
          c = a / 8,
          l = [],
          u = 0,
          undefined;
        u < c;
        u++
      ) {
        var s;
        var a;
        var c;
        var l;
        var u;
        var d = s[u];
        var p = d.high;
        var h = d.low;
        p =
          (16711935 & ((p << 8) | (p >>> 24))) |
          (4278255360 & ((p << 24) | (p >>> 8)));
        h =
          (16711935 & ((h << 8) | (h >>> 24))) |
          (4278255360 & ((h << 24) | (h >>> 8)));
        l.push(h);
        l.push(p);
      }
      return new o.init(l, a);
    },
    clone: function () {
      for (
        e = i.clone.call(this),
          t = e._state = this._state.slice(0),
          n = 0,
          undefined;
        n < 25;
        n++
      ) {
        var e;
        var t;
        var n;
        t[n] = t[n].clone();
      }
      return e;
    },
  }));
  t.SHA3 = i._createHelper(p);
  t.HmacSHA3 = i._createHmacHelper(p);
})(Math);
module.exports = M_random_stuff_maybe.SHA3;
