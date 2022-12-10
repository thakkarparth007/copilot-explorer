var M_random_stuff_NOTSURE;
M_random_stuff_NOTSURE = require("random-stuff");
require("cipher-core");
M_random_stuff_NOTSURE.pad.Iso10126 = {
  pad: function (e, t) {
    var n = 4 * t,
      o = n - (e.sigBytes % n);
    e.concat(M_random_stuff_NOTSURE.lib.WordArray.random(o - 1)).concat(
      M_random_stuff_NOTSURE.lib.WordArray.create([o << 24], 1)
    );
  },
  unpad: function (e) {
    var t = 255 & e.words[(e.sigBytes - 1) >>> 2];
    e.sigBytes -= t;
  },
};
module.exports = M_random_stuff_NOTSURE.pad.Iso10126;
