var r;
var o;
var i;
var s;
var a;
var c;
var l;
var M_random_stuff_maybe;
o = (r = M_random_stuff_maybe = require("random-stuff")).lib;
i = o.WordArray;
s = o.Hasher;
a = r.algo;
c = [];
l = a.SHA1 = s.extend({
  _doReset: function () {
    this._hash = new i.init([
      1732584193, 4023233417, 2562383102, 271733878, 3285377520,
    ]);
  },
  _doProcessBlock: function (e, t) {
    for (
      n = this._hash.words,
        r = n[0],
        o = n[1],
        i = n[2],
        s = n[3],
        a = n[4],
        l = 0,
        undefined;
      l < 80;
      l++
    ) {
      var n;
      var r;
      var o;
      var i;
      var s;
      var a;
      var l;
      if (l < 16) c[l] = 0 | e[t + l];
      else {
        var u = c[l - 3] ^ c[l - 8] ^ c[l - 14] ^ c[l - 16];
        c[l] = (u << 1) | (u >>> 31);
      }
      var d = ((r << 5) | (r >>> 27)) + a + c[l];
      d +=
        l < 20
          ? 1518500249 + ((o & i) | (~o & s))
          : l < 40
          ? 1859775393 + (o ^ i ^ s)
          : l < 60
          ? ((o & i) | (o & s) | (i & s)) - 1894007588
          : (o ^ i ^ s) - 899497514;
      a = s;
      s = i;
      i = (o << 30) | (o >>> 2);
      o = r;
      r = d;
    }
    n[0] = (n[0] + r) | 0;
    n[1] = (n[1] + o) | 0;
    n[2] = (n[2] + i) | 0;
    n[3] = (n[3] + s) | 0;
    n[4] = (n[4] + a) | 0;
  },
  _doFinalize: function () {
    var e = this._data;
    var t = e.words;
    var n = 8 * this._nDataBytes;
    var r = 8 * e.sigBytes;
    t[r >>> 5] |= 128 << (24 - (r % 32));
    t[14 + (((r + 64) >>> 9) << 4)] = Math.floor(n / 4294967296);
    t[15 + (((r + 64) >>> 9) << 4)] = n;
    e.sigBytes = 4 * t.length;
    this._process();
    return this._hash;
  },
  clone: function () {
    var e = s.clone.call(this);
    e._hash = this._hash.clone();
    return e;
  },
});
r.SHA1 = s._createHelper(l);
r.HmacSHA1 = s._createHmacHelper(l);
module.exports = M_random_stuff_maybe.SHA1;
