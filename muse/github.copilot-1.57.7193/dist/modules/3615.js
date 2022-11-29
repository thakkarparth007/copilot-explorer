var r;
r = require(8249);
require(5109);
r.pad.AnsiX923 = {
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
module.exports = r.pad.Ansix923;
