var r, o, i, s, a, M_random_stuff_NOTSURE;
M_random_stuff_NOTSURE = require("random-stuff");
require("sha256");
o = (r = M_random_stuff_NOTSURE).lib.WordArray;
i = r.algo;
s = i.SHA256;
a = i.SHA224 = s.extend({
  _doReset: function () {
    this._hash = new o.init([
      3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025,
      1694076839, 3204075428,
    ]);
  },
  _doFinalize: function () {
    var e = s._doFinalize.call(this);
    e.sigBytes -= 4;
    return e;
  },
});
r.SHA224 = s._createHelper(a);
r.HmacSHA224 = s._createHmacHelper(a);
module.exports = M_random_stuff_NOTSURE.SHA224;
