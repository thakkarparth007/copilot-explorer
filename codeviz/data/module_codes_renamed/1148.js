var r, M_random_stuff_NOTSURE;
M_random_stuff_NOTSURE = require("random-stuff");
require("cipher-core");
(r = M_random_stuff_NOTSURE.lib.BlockCipherMode.extend()).Encryptor = r.extend({
  processBlock: function (e, t) {
    this._cipher.encryptBlock(e, t);
  },
});
r.Decryptor = r.extend({
  processBlock: function (e, t) {
    this._cipher.decryptBlock(e, t);
  },
});
M_random_stuff_NOTSURE.mode.ECB = r;
module.exports = M_random_stuff_NOTSURE.mode.ECB;
