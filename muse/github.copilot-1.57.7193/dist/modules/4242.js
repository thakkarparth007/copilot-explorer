var r, o, i;
i = require(8249);
require(5109);
o = (r = i.lib.BlockCipherMode.extend()).Encryptor = r.extend({
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
i.mode.CTR = r;
module.exports = i.mode.CTR;