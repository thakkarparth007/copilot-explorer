var r;
r = require(8249);
require(5109);
r.mode.CTRGladman = function () {
  var e = r.lib.BlockCipherMode.extend();
  function t(e) {
    if (255 == (e >> 24 & 255)) {
      var t = e >> 16 & 255,
        n = e >> 8 & 255,
        r = 255 & e;
      255 === t ? (t = 0, 255 === n ? (n = 0, 255 === r ? r = 0 : ++r) : ++n) : ++t;
      e = 0;
      e += t << 16;
      e += n << 8;
      e += r;
    } else e += 1 << 24;
    return e;
  }
  var n = e.Encryptor = e.extend({
    processBlock: function (e, n) {
      var r = this._cipher,
        o = r.blockSize,
        i = this._iv,
        s = this._counter;
      i && (s = this._counter = i.slice(0), this._iv = undefined);
      (function (e) {
        0 === (e[0] = t(e[0])) && (e[1] = t(e[1]));
      })(s);
      var a = s.slice(0);
      r.encryptBlock(a, 0);
      for (var c = 0; c < o; c++) e[n + c] ^= a[c];
    }
  });
  e.Decryptor = n;
  return e;
}();
module.exports = r.mode.CTRGladman;