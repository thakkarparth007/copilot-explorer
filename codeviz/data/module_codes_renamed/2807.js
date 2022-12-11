var M_random_stuff_maybe;
M_random_stuff_maybe = require("random-stuff");
require("cipher-core");
M_random_stuff_maybe.pad.Iso10126 = {
  pad: function (e, t) {
    var n = 4 * t;
    var o = n - (e.sigBytes % n);
    e.concat(M_random_stuff_maybe.lib.WordArray.random(o - 1)).concat(
      M_random_stuff_maybe.lib.WordArray.create([o << 24], 1)
    );
  },
  unpad: function (e) {
    var t = 255 & e.words[(e.sigBytes - 1) >>> 2];
    e.sigBytes -= t;
  },
};
module.exports = M_random_stuff_maybe.pad.Iso10126;
