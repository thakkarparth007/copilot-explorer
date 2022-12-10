var M_random_stuff_NOTSURE;
M_random_stuff_NOTSURE = require("random-stuff");
require("cipher-core");
M_random_stuff_NOTSURE.mode.CFB = (function () {
  var e = M_random_stuff_NOTSURE.lib.BlockCipherMode.extend();
  function t(e, t, n, r) {
    var o,
      i = this._iv;
    if (i) {
      o = i.slice(0);
      this._iv = undefined;
    } else {
      o = this._prevBlock;
    }
    r.encryptBlock(o, 0);
    for (var s = 0; s < n; s++) e[t + s] ^= o[s];
  }
  e.Encryptor = e.extend({
    processBlock: function (e, n) {
      var r = this._cipher,
        o = r.blockSize;
      t.call(this, e, n, o, r);
      this._prevBlock = e.slice(n, n + o);
    },
  });
  e.Decryptor = e.extend({
    processBlock: function (e, n) {
      var r = this._cipher,
        o = r.blockSize,
        i = e.slice(n, n + o);
      t.call(this, e, n, o, r);
      this._prevBlock = i;
    },
  });
  return e;
})();
module.exports = M_random_stuff_NOTSURE.mode.CFB;
