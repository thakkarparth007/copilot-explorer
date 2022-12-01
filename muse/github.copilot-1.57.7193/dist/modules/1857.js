var r;
r = require(8249);
require(8269);
require(8214);
require(888);
require(5109);
(function () {
  var e = r,
    t = e.lib.StreamCipher,
    n = e.algo,
    o = (n.RC4 = t.extend({
      _doReset: function () {
        for (
          var e = this._key,
            t = e.words,
            n = e.sigBytes,
            r = (this._S = []),
            o = 0;
          o < 256;
          o++
        )
          r[o] = o;
        o = 0;
        for (var i = 0; o < 256; o++) {
          var s = o % n,
            a = (t[s >>> 2] >>> (24 - (s % 4) * 8)) & 255;
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
    for (var e = this._S, t = this._i, n = this._j, r = 0, o = 0; o < 4; o++) {
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
module.exports = r.RC4;