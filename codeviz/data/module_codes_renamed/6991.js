var M_random_stuff_NOTSURE;
M_random_stuff_NOTSURE = require("random-stuff");
require("cipher-core");
M_random_stuff_NOTSURE.pad.NoPadding = {
  pad: function () {},
  unpad: function () {},
};
module.exports = M_random_stuff_NOTSURE.pad.NoPadding;
