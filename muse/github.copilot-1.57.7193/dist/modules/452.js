var r;
r = require(8249);
require(8269);
require(8214);
require(888);
require(5109);
(function () {
  var e = r;
  var t = e.lib.BlockCipher;
  var n = e.algo;
  var o = [];
  var i = [];
  var s = [];
  var a = [];
  var c = [];
  var l = [];
  var u = [];
  var d = [];
  var p = [];
  var h = [];
  !(function () {
    for (e = [], t = 0, undefined; t < 256; t++) {
      var e;
      var t;
      e[t] = t < 128 ? t << 1 : (t << 1) ^ 283;
    }
    var n = 0;
    var r = 0;
    for (t = 0; t < 256; t++) {
      var f = r ^ (r << 1) ^ (r << 2) ^ (r << 3) ^ (r << 4);
      f = (f >>> 8) ^ (255 & f) ^ 99;
      o[n] = f;
      i[f] = n;
      var m = e[n];
      var g = e[m];
      var _ = e[g];
      var y = (257 * e[f]) ^ (16843008 * f);
      s[n] = (y << 24) | (y >>> 8);
      a[n] = (y << 16) | (y >>> 16);
      c[n] = (y << 8) | (y >>> 24);
      l[n] = y;
      y = (16843009 * _) ^ (65537 * g) ^ (257 * m) ^ (16843008 * n);
      u[f] = (y << 24) | (y >>> 8);
      d[f] = (y << 16) | (y >>> 16);
      p[f] = (y << 8) | (y >>> 24);
      h[f] = y;
      if (n) {
        n = m ^ e[e[e[_ ^ m]]];
        r ^= e[e[r]];
      } else {
        n = r = 1;
      }
    }
  })();
  var f = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
  var m = (n.AES = t.extend({
    _doReset: function () {
      if (!this._nRounds || this._keyPriorReset !== this._key) {
        for (
          e = this._keyPriorReset = this._key,
            t = e.words,
            n = e.sigBytes / 4,
            r = 4 * ((this._nRounds = n + 6) + 1),
            i = this._keySchedule = [],
            s = 0,
            undefined;
          s < r;
          s++
        ) {
          var e;
          var t;
          var n;
          var r;
          var i;
          var s;
          if (s < n) {
            i[s] = t[s];
          } else {
            l = i[s - 1];
            if (s % n) {
              if (n > 6 && s % n == 4) {
                l =
                  (o[l >>> 24] << 24) |
                  (o[(l >>> 16) & 255] << 16) |
                  (o[(l >>> 8) & 255] << 8) |
                  o[255 & l];
              }
            } else {
              l =
                (o[(l = (l << 8) | (l >>> 24)) >>> 24] << 24) |
                (o[(l >>> 16) & 255] << 16) |
                (o[(l >>> 8) & 255] << 8) |
                o[255 & l];
              l ^= f[(s / n) | 0] << 24;
            }
            i[s] = i[s - n] ^ l;
          }
        }
        for (a = this._invKeySchedule = [], c = 0, undefined; c < r; c++) {
          var a;
          var c;
          s = r - c;
          if (c % 4) var l = i[s];
          else l = i[s - 4];
          a[c] =
            c < 4 || s <= 4
              ? l
              : u[o[l >>> 24]] ^
                d[o[(l >>> 16) & 255]] ^
                p[o[(l >>> 8) & 255]] ^
                h[o[255 & l]];
        }
      }
    },
    encryptBlock: function (e, t) {
      this._doCryptBlock(e, t, this._keySchedule, s, a, c, l, o);
    },
    decryptBlock: function (e, t) {
      var n = e[t + 1];
      e[t + 1] = e[t + 3];
      e[t + 3] = n;
      this._doCryptBlock(e, t, this._invKeySchedule, u, d, p, h, i);
      n = e[t + 1];
      e[t + 1] = e[t + 3];
      e[t + 3] = n;
    },
    _doCryptBlock: function (e, t, n, r, o, i, s, a) {
      for (
        c = this._nRounds,
          l = e[t] ^ n[0],
          u = e[t + 1] ^ n[1],
          d = e[t + 2] ^ n[2],
          p = e[t + 3] ^ n[3],
          h = 4,
          f = 1,
          undefined;
        f < c;
        f++
      ) {
        var c;
        var l;
        var u;
        var d;
        var p;
        var h;
        var f;
        var m =
          r[l >>> 24] ^
          o[(u >>> 16) & 255] ^
          i[(d >>> 8) & 255] ^
          s[255 & p] ^
          n[h++];
        var g =
          r[u >>> 24] ^
          o[(d >>> 16) & 255] ^
          i[(p >>> 8) & 255] ^
          s[255 & l] ^
          n[h++];
        var _ =
          r[d >>> 24] ^
          o[(p >>> 16) & 255] ^
          i[(l >>> 8) & 255] ^
          s[255 & u] ^
          n[h++];
        var y =
          r[p >>> 24] ^
          o[(l >>> 16) & 255] ^
          i[(u >>> 8) & 255] ^
          s[255 & d] ^
          n[h++];
        l = m;
        u = g;
        d = _;
        p = y;
      }
      m =
        ((a[l >>> 24] << 24) |
          (a[(u >>> 16) & 255] << 16) |
          (a[(d >>> 8) & 255] << 8) |
          a[255 & p]) ^
        n[h++];
      g =
        ((a[u >>> 24] << 24) |
          (a[(d >>> 16) & 255] << 16) |
          (a[(p >>> 8) & 255] << 8) |
          a[255 & l]) ^
        n[h++];
      _ =
        ((a[d >>> 24] << 24) |
          (a[(p >>> 16) & 255] << 16) |
          (a[(l >>> 8) & 255] << 8) |
          a[255 & u]) ^
        n[h++];
      y =
        ((a[p >>> 24] << 24) |
          (a[(l >>> 16) & 255] << 16) |
          (a[(u >>> 8) & 255] << 8) |
          a[255 & d]) ^
        n[h++];
      e[t] = m;
      e[t + 1] = g;
      e[t + 2] = _;
      e[t + 3] = y;
    },
    keySize: 8,
  }));
  e.AES = t._createHelper(m);
})();
module.exports = r.AES;