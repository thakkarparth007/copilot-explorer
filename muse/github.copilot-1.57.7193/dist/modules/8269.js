var r, o, i;
r = require(8249);
i = (o = r).lib.WordArray;
o.enc.Base64 = {
  stringify: function (e) {
    var t = e.words,
      n = e.sigBytes,
      r = this._map;
    e.clamp();
    for (var o = [], i = 0; i < n; i += 3)
      for (
        var s =
            (((t[i >>> 2] >>> (24 - (i % 4) * 8)) & 255) << 16) |
            (((t[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 255) << 8) |
            ((t[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 255),
          a = 0;
        a < 4 && i + 0.75 * a < n;
        a++
      )
        o.push(r.charAt((s >>> (6 * (3 - a))) & 63));
    var c = r.charAt(64);
    if (c) for (; o.length % 4; ) o.push(c);
    return o.join("");
  },
  parse: function (e) {
    var t = e.length,
      n = this._map,
      r = this._reverseMap;
    if (!r) {
      r = this._reverseMap = [];
      for (var o = 0; o < n.length; o++) r[n.charCodeAt(o)] = o;
    }
    var s = n.charAt(64);
    if (s) {
      var a = e.indexOf(s);
      if (-1 !== a) {
        t = a;
      }
    }
    return (function (e, t, n) {
      for (var r = [], o = 0, s = 0; s < t; s++)
        if (s % 4) {
          var a =
            (n[e.charCodeAt(s - 1)] << ((s % 4) * 2)) |
            (n[e.charCodeAt(s)] >>> (6 - (s % 4) * 2));
          r[o >>> 2] |= a << (24 - (o % 4) * 8);
          o++;
        }
      return i.create(r, o);
    })(e, t, r);
  },
  _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
};
module.exports = r.enc.Base64;
