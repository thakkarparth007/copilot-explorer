var r;
var M_random_stuff_maybe;
M_random_stuff_maybe = require("random-stuff");
require("cipher-core");
(r = M_random_stuff_maybe.lib.BlockCipherMode.extend()).Encryptor = r.extend({
  processBlock: function (e, t) {
    this._cipher.encryptBlock(e, t);
  },
});
r.Decryptor = r.extend({
  processBlock: function (e, t) {
    this._cipher.decryptBlock(e, t);
  },
});
M_random_stuff_maybe.mode.ECB = r;
module.exports = M_random_stuff_maybe.mode.ECB;
