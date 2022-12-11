var M_random_stuff_maybe;
var o;
var i;
o = (M_random_stuff_maybe = require("random-stuff")).lib.Base;
i = M_random_stuff_maybe.enc.Utf8;
module.exports = void (M_random_stuff_maybe.algo.HMAC = o.extend({
  init: function (e, t) {
    (e = this._hasher = new e.init()), "string" == typeof t && (t = i.parse(t));
    var n = e.blockSize,
      r = 4 * n;
    t.sigBytes > r && (t = e.finalize(t)), t.clamp();
    for (
      var o = (this._oKey = t.clone()),
        s = (this._iKey = t.clone()),
        a = o.words,
        c = s.words,
        l = 0;
      l < n;
      l++
    )
      (a[l] ^= 1549556828), (c[l] ^= 909522486);
    (o.sigBytes = s.sigBytes = r), this.reset();
  },
  reset: function () {
    var e = this._hasher;
    e.reset(), e.update(this._iKey);
  },
  update: function (e) {
    return this._hasher.update(e), this;
  },
  finalize: function (e) {
    var t = this._hasher,
      n = t.finalize(e);
    return t.reset(), t.finalize(this._oKey.clone().concat(n));
  },
}));
