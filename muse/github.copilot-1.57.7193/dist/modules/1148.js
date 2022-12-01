var r, o;
o = require(8249);
require(5109);
(r = o.lib.BlockCipherMode.extend()).Encryptor = r.extend({
  processBlock: function (e, t) {
    this._cipher.encryptBlock(e, t);
  },
});
r.Decryptor = r.extend({
  processBlock: function (e, t) {
    this._cipher.decryptBlock(e, t);
  },
});
o.mode.ECB = r;
module.exports = o.mode.ECB;