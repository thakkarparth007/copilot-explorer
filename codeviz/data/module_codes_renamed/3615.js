var M_random_stuff_NOTSURE;
M_random_stuff_NOTSURE = require("random-stuff");
require("cipher-core");
M_random_stuff_NOTSURE.pad.AnsiX923 = {
  pad: function (e, t) {
    var n = e.sigBytes,
      r = 4 * t,
      o = r - (n % r),
      i = n + o - 1;
    e.clamp();
    e.words[i >>> 2] |= o << (24 - (i % 4) * 8);
    e.sigBytes += o;
  },
  unpad: function (e) {
    var t = 255 & e.words[(e.sigBytes - 1) >>> 2];
    e.sigBytes -= t;
  },
};
module.exports = M_random_stuff_NOTSURE.pad.Ansix923;
