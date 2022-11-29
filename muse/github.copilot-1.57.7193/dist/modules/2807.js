var r;
r = require(8249);
require(5109);
r.pad.Iso10126 = {
  pad: function (e, t) {
    var n = 4 * t,
      o = n - e.sigBytes % n;
    e.concat(r.lib.WordArray.random(o - 1)).concat(r.lib.WordArray.create([o << 24], 1));
  },
  unpad: function (e) {
    var t = 255 & e.words[e.sigBytes - 1 >>> 2];
    e.sigBytes -= t;
  }
};
module.exports = r.pad.Iso10126;