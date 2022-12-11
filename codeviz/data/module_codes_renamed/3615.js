var M_random_stuff_maybe;
M_random_stuff_maybe = require("random-stuff");
require("cipher-core");
M_random_stuff_maybe.pad.AnsiX923 = {
  pad: function (e, t) {
    var n = e.sigBytes;
    var r = 4 * t;
    var o = r - (n % r);
    var i = n + o - 1;
    e.clamp();
    e.words[i >>> 2] |= o << (24 - (i % 4) * 8);
    e.sigBytes += o;
  },
  unpad: function (e) {
    var t = 255 & e.words[(e.sigBytes - 1) >>> 2];
    e.sigBytes -= t;
  },
};
module.exports = M_random_stuff_maybe.pad.Ansix923;
