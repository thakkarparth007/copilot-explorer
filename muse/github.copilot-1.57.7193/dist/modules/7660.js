var r, o, i;
module.exports = (i = require(8249), require(5109), i.mode.OFB = (o = (r = i.lib.BlockCipherMode.extend()).Encryptor = r.extend({
  processBlock: function (e, t) {
    var n = this._cipher,
      r = n.blockSize,
      o = this._iv,
      i = this._keystream;
    o && (i = this._keystream = o.slice(0), this._iv = undefined);
    n.encryptBlock(i, 0);
    for (var s = 0; s < r; s++) e[t + s] ^= i[s];
  }
}), r.Decryptor = o, r), i.mode.OFB);