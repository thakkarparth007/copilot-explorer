var M_random_stuff_NOTSURE;
M_random_stuff_NOTSURE = require("random-stuff");
require("cipher-core");
M_random_stuff_NOTSURE.pad.Iso97971 = {
  pad: function (e, t) {
    e.concat(M_random_stuff_NOTSURE.lib.WordArray.create([2147483648], 1));
    M_random_stuff_NOTSURE.pad.ZeroPadding.pad(e, t);
  },
  unpad: function (e) {
    M_random_stuff_NOTSURE.pad.ZeroPadding.unpad(e);
    e.sigBytes--;
  },
};
module.exports = M_random_stuff_NOTSURE.pad.Iso97971;
