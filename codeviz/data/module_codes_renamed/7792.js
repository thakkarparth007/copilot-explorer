var r;
var o;
var i;
var s;
var a;
var M_random_stuff_maybe;
M_random_stuff_maybe = require("random-stuff");
require("sha256");
o = (r = M_random_stuff_maybe).lib.WordArray;
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
module.exports = M_random_stuff_maybe.SHA224;
