var r;
r = require(8249);
(function () {
  var e = r;
  var t = e.lib.WordArray;
  var n = e.enc;
  function o(e) {
    return ((e << 8) & 4278255360) | ((e >>> 8) & 16711935);
  }
  n.Utf16 = n.Utf16BE = {
    stringify: function (e) {
      for (
        t = e.words, n = e.sigBytes, r = [], o = 0, undefined;
        o < n;
        o += 2
      ) {
        var t;
        var n;
        var r;
        var o;
        var i = (t[o >>> 2] >>> (16 - (o % 4) * 8)) & 65535;
        r.push(String.fromCharCode(i));
      }
      return r.join("");
    },
    parse: function (e) {
      for (n = e.length, r = [], o = 0, undefined; o < n; o++) {
        var n;
        var r;
        var o;
        r[o >>> 1] |= e.charCodeAt(o) << (16 - (o % 2) * 16);
      }
      return t.create(r, 2 * n);
    },
  };
  n.Utf16LE = {
    stringify: function (e) {
      for (
        t = e.words, n = e.sigBytes, r = [], i = 0, undefined;
        i < n;
        i += 2
      ) {
        var t;
        var n;
        var r;
        var i;
        var s = o((t[i >>> 2] >>> (16 - (i % 4) * 8)) & 65535);
        r.push(String.fromCharCode(s));
      }
      return r.join("");
    },
    parse: function (e) {
      for (n = e.length, r = [], i = 0, undefined; i < n; i++) {
        var n;
        var r;
        var i;
        r[i >>> 1] |= o(e.charCodeAt(i) << (16 - (i % 2) * 16));
      }
      return t.create(r, 2 * n);
    },
  };
})();
module.exports = r.enc.Utf16;