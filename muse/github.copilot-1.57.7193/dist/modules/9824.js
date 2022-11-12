var r, o, i;
module.exports = (o = (r = require(8249)).lib.Base, i = r.enc.Utf8, void (r.algo.HMAC = o.extend({
  init: function (e, t) {
    e = this._hasher = new e.init();
    "string" == typeof t && (t = i.parse(t));
    var n = e.blockSize,
      r = 4 * n;
    t.sigBytes > r && (t = e.finalize(t));
    t.clamp();
    for (var o = this._oKey = t.clone(), s = this._iKey = t.clone(), a = o.words, c = s.words, l = 0; l < n; l++) {
      a[l] ^= 1549556828;
      c[l] ^= 909522486;
    }
    o.sigBytes = s.sigBytes = r;
    this.reset();
  },
  reset: function () {
    var e = this._hasher;
    e.reset();
    e.update(this._iKey);
  },
  update: function (e) {
    this._hasher.update(e);
    return this;
  },
  finalize: function (e) {
    var t = this._hasher,
      n = t.finalize(e);
    t.reset();
    return t.finalize(this._oKey.clone().concat(n));
  }
})));