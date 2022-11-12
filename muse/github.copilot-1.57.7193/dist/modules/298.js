var r;
module.exports = (r = require(8249), function () {
  var e = r,
    t = e.lib.WordArray,
    n = e.enc;
  function o(e) {
    return e << 8 & 4278255360 | e >>> 8 & 16711935;
  }
  n.Utf16 = n.Utf16BE = {
    stringify: function (e) {
      for (var t = e.words, n = e.sigBytes, r = [], o = 0; o < n; o += 2) {
        var i = t[o >>> 2] >>> 16 - o % 4 * 8 & 65535;
        r.push(String.fromCharCode(i));
      }
      return r.join("");
    },
    parse: function (e) {
      for (var n = e.length, r = [], o = 0; o < n; o++) r[o >>> 1] |= e.charCodeAt(o) << 16 - o % 2 * 16;
      return t.create(r, 2 * n);
    }
  };
  n.Utf16LE = {
    stringify: function (e) {
      for (var t = e.words, n = e.sigBytes, r = [], i = 0; i < n; i += 2) {
        var s = o(t[i >>> 2] >>> 16 - i % 4 * 8 & 65535);
        r.push(String.fromCharCode(s));
      }
      return r.join("");
    },
    parse: function (e) {
      for (var n = e.length, r = [], i = 0; i < n; i++) r[i >>> 1] |= o(e.charCodeAt(i) << 16 - i % 2 * 16);
      return t.create(r, 2 * n);
    }
  };
}(), r.enc.Utf16);