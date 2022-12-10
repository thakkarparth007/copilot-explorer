var r, o, M_random_stuff_NOTSURE;
M_random_stuff_NOTSURE = require("random-stuff");
require("cipher-core");
o = (r = M_random_stuff_NOTSURE.lib.BlockCipherMode.extend()).Encryptor =
  r.extend({
    processBlock: function (e, t) {
      var n = this._cipher,
        r = n.blockSize,
        o = this._iv,
        i = this._counter;
      if (o) {
        i = this._counter = o.slice(0);
        this._iv = undefined;
      }
      var s = i.slice(0);
      n.encryptBlock(s, 0);
      i[r - 1] = (i[r - 1] + 1) | 0;
      for (var a = 0; a < r; a++) e[t + a] ^= s[a];
    },
  });
r.Decryptor = o;
M_random_stuff_NOTSURE.mode.CTR = r;
module.exports = M_random_stuff_NOTSURE.mode.CTR;
