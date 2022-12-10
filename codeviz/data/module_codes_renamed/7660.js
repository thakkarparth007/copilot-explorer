var r, o, M_random_stuff_NOTSURE;
M_random_stuff_NOTSURE = require("random-stuff");
require("cipher-core");
o = (r = M_random_stuff_NOTSURE.lib.BlockCipherMode.extend()).Encryptor =
  r.extend({
    processBlock: function (e, t) {
      var n = this._cipher,
        r = n.blockSize,
        o = this._iv,
        i = this._keystream;
      if (o) {
        i = this._keystream = o.slice(0);
        this._iv = undefined;
      }
      n.encryptBlock(i, 0);
      for (var s = 0; s < r; s++) e[t + s] ^= i[s];
    },
  });
r.Decryptor = o;
M_random_stuff_NOTSURE.mode.OFB = r;
module.exports = M_random_stuff_NOTSURE.mode.OFB;
