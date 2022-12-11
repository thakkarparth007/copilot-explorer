var r;
var o;
var i;
var M_random_stuff_maybe;
M_random_stuff_maybe = require("random-stuff");
require("cipher-core");
o = (r = M_random_stuff_maybe).lib.CipherParams;
i = r.enc.Hex;
r.format.Hex = {
  stringify: function (e) {
    return e.ciphertext.toString(i);
  },
  parse: function (e) {
    var t = i.parse(e);
    return o.create({
      ciphertext: t,
    });
  },
};
module.exports = M_random_stuff_maybe.format.Hex;
