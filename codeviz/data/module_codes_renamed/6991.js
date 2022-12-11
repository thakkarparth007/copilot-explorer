var M_random_stuff_maybe;
M_random_stuff_maybe = require("random-stuff");
require("cipher-core");
M_random_stuff_maybe.pad.NoPadding = {
  pad: function () {},
  unpad: function () {},
};
module.exports = M_random_stuff_maybe.pad.NoPadding;
