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
  var o = (n.RC4 = t.extend({
    _doReset: function () {
      for (
        e = this._key,
          t = e.words,
          n = e.sigBytes,
          r = this._S = [],
          o = 0,
          undefined;
        o < 256;
        o++
      ) {
        var e;
        var t;
        var n;
        var r;
        var o;
        r[o] = o;
      }
      o = 0;
      for (var i = 0; o < 256; o++) {
        var s = o % n;
        var a = (t[s >>> 2] >>> (24 - (s % 4) * 8)) & 255;
        i = (i + r[o] + a) % 256;
        var c = r[o];
        r[o] = r[i];
        r[i] = c;
      }
      this._i = this._j = 0;
    },
    _doProcessBlock: function (e, t) {
      e[t] ^= i.call(this);
    },
    keySize: 8,
    ivSize: 0,
  }));
  function i() {
    for (
      e = this._S, t = this._i, n = this._j, r = 0, o = 0, undefined;
      o < 4;
      o++
    ) {
      var e;
      var t;
      var n;
      var r;
      var o;
      n = (n + e[(t = (t + 1) % 256)]) % 256;
      var i = e[t];
      e[t] = e[n];
      e[n] = i;
      r |= e[(e[t] + e[n]) % 256] << (24 - 8 * o);
    }
    this._i = t;
    this._j = n;
    return r;
  }
  e.RC4 = t._createHelper(o);
  var s = (n.RC4Drop = o.extend({
    cfg: o.cfg.extend({
      drop: 192,
    }),
    _doReset: function () {
      o._doReset.call(this);
      for (var e = this.cfg.drop; e > 0; e--) i.call(this);
    },
  }));
  e.RC4Drop = t._createHelper(s);
})();
module.exports = M_random_stuff_maybe.RC4;
