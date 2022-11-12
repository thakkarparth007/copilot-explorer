var r, o;
module.exports = (o = require(8249), require(5109), o.mode.ECB = ((r = o.lib.BlockCipherMode.extend()).Encryptor = r.extend({
  processBlock: function (e, t) {
    this._cipher.encryptBlock(e, t);
  }
}), r.Decryptor = r.extend({
  processBlock: function (e, t) {
    this._cipher.decryptBlock(e, t);
  }
}), r), o.mode.ECB);