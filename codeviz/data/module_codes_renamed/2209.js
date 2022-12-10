var r, o, i, M_random_stuff_NOTSURE;
M_random_stuff_NOTSURE = require("random-stuff");
require("cipher-core");
o = (r = M_random_stuff_NOTSURE).lib.CipherParams;
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
module.exports = M_random_stuff_NOTSURE.format.Hex;
