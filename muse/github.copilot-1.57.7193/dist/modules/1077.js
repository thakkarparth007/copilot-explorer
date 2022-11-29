var r;
r = require(8249);
require(5109);
r.pad.Iso97971 = {
  pad: function (e, t) {
    e.concat(r.lib.WordArray.create([2147483648], 1));
    r.pad.ZeroPadding.pad(e, t);
  },
  unpad: function (e) {
    r.pad.ZeroPadding.unpad(e);
    e.sigBytes--;
  },
};
module.exports = r.pad.Iso97971;
