var M_random_stuff_maybe;
M_random_stuff_maybe = require("random-stuff");
require("base64-encoding-stuff");
require("md5");
require("evpkdf");
require("cipher-core");
(function () {
  var e = M_random_stuff_maybe;
  var t = e.lib.StreamCipher;
  var n = e.algo;
  var o = [];
  var i = [];
  var s = [];
  var a = (n.RabbitLegacy = t.extend({
    _doReset: function () {
      var e = this._key.words;
      var t = this.cfg.iv;
      var n = (this._X = [
        e[0],
        (e[3] << 16) | (e[2] >>> 16),
        e[1],
        (e[0] << 16) | (e[3] >>> 16),
        e[2],
        (e[1] << 16) | (e[0] >>> 16),
        e[3],
        (e[2] << 16) | (e[1] >>> 16),
      ]);
      var r = (this._C = [
        (e[2] << 16) | (e[2] >>> 16),
        (4294901760 & e[0]) | (65535 & e[1]),
        (e[3] << 16) | (e[3] >>> 16),
        (4294901760 & e[1]) | (65535 & e[2]),
        (e[0] << 16) | (e[0] >>> 16),
        (4294901760 & e[2]) | (65535 & e[3]),
        (e[1] << 16) | (e[1] >>> 16),
        (4294901760 & e[3]) | (65535 & e[0]),
      ]);
      this._b = 0;
      for (var o = 0; o < 4; o++) c.call(this);
      for (o = 0; o < 8; o++) r[o] ^= n[(o + 4) & 7];
      if (t) {
        var i = t.words;
        var s = i[0];
        var a = i[1];
        var l =
          (16711935 & ((s << 8) | (s >>> 24))) |
          (4278255360 & ((s << 24) | (s >>> 8)));
        var u =
          (16711935 & ((a << 8) | (a >>> 24))) |
          (4278255360 & ((a << 24) | (a >>> 8)));
        var d = (l >>> 16) | (4294901760 & u);
        var p = (u << 16) | (65535 & l);
        for (
          r[0] ^= l,
            r[1] ^= d,
            r[2] ^= u,
            r[3] ^= p,
            r[4] ^= l,
            r[5] ^= d,
            r[6] ^= u,
            r[7] ^= p,
            o = 0;
          o < 4;
          o++
        )
          c.call(this);
      }
    },
    _doProcessBlock: function (e, t) {
      var n = this._X;
      c.call(this);
      o[0] = n[0] ^ (n[5] >>> 16) ^ (n[3] << 16);
      o[1] = n[2] ^ (n[7] >>> 16) ^ (n[5] << 16);
      o[2] = n[4] ^ (n[1] >>> 16) ^ (n[7] << 16);
      o[3] = n[6] ^ (n[3] >>> 16) ^ (n[1] << 16);
      for (var r = 0; r < 4; r++) {
        o[r] =
          (16711935 & ((o[r] << 8) | (o[r] >>> 24))) |
          (4278255360 & ((o[r] << 24) | (o[r] >>> 8)));
        e[t + r] ^= o[r];
      }
    },
    blockSize: 4,
    ivSize: 2,
  }));
  function c() {
    for (e = this._X, t = this._C, n = 0, undefined; n < 8; n++) {
      var e;
      var t;
      var n;
      i[n] = t[n];
    }
    for (
      t[0] = (t[0] + 1295307597 + this._b) | 0,
        t[1] = (t[1] + 3545052371 + (t[0] >>> 0 < i[0] >>> 0 ? 1 : 0)) | 0,
        t[2] = (t[2] + 886263092 + (t[1] >>> 0 < i[1] >>> 0 ? 1 : 0)) | 0,
        t[3] = (t[3] + 1295307597 + (t[2] >>> 0 < i[2] >>> 0 ? 1 : 0)) | 0,
        t[4] = (t[4] + 3545052371 + (t[3] >>> 0 < i[3] >>> 0 ? 1 : 0)) | 0,
        t[5] = (t[5] + 886263092 + (t[4] >>> 0 < i[4] >>> 0 ? 1 : 0)) | 0,
        t[6] = (t[6] + 1295307597 + (t[5] >>> 0 < i[5] >>> 0 ? 1 : 0)) | 0,
        t[7] = (t[7] + 3545052371 + (t[6] >>> 0 < i[6] >>> 0 ? 1 : 0)) | 0,
        this._b = t[7] >>> 0 < i[7] >>> 0 ? 1 : 0,
        n = 0;
      n < 8;
      n++
    ) {
      var r = e[n] + t[n];
      var o = 65535 & r;
      var a = r >>> 16;
      var c = ((((o * o) >>> 17) + o * a) >>> 15) + a * a;
      var l = (((4294901760 & r) * r) | 0) + (((65535 & r) * r) | 0);
      s[n] = c ^ l;
    }
    e[0] =
      (s[0] + ((s[7] << 16) | (s[7] >>> 16)) + ((s[6] << 16) | (s[6] >>> 16))) |
      0;
    e[1] = (s[1] + ((s[0] << 8) | (s[0] >>> 24)) + s[7]) | 0;
    e[2] =
      (s[2] + ((s[1] << 16) | (s[1] >>> 16)) + ((s[0] << 16) | (s[0] >>> 16))) |
      0;
    e[3] = (s[3] + ((s[2] << 8) | (s[2] >>> 24)) + s[1]) | 0;
    e[4] =
      (s[4] + ((s[3] << 16) | (s[3] >>> 16)) + ((s[2] << 16) | (s[2] >>> 16))) |
      0;
    e[5] = (s[5] + ((s[4] << 8) | (s[4] >>> 24)) + s[3]) | 0;
    e[6] =
      (s[6] + ((s[5] << 16) | (s[5] >>> 16)) + ((s[4] << 16) | (s[4] >>> 16))) |
      0;
    e[7] = (s[7] + ((s[6] << 8) | (s[6] >>> 24)) + s[5]) | 0;
  }
  e.RabbitLegacy = t._createHelper(a);
})();
module.exports = M_random_stuff_maybe.RabbitLegacy;
