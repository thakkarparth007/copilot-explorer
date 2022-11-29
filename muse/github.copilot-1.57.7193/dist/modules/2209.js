var r, o, i, s;
s = require(8249);
require(5109);
o = (r = s).lib.CipherParams;
i = r.enc.Hex;
r.format.Hex = {
  stringify: function (e) {
    return e.ciphertext.toString(i);
  },
  parse: function (e) {
    var t = i.parse(e);
    return o.create({
      ciphertext: t
    });
  }
};
module.exports = s.format.Hex;