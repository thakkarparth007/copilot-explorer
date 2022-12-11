var r;
r = require(8249);
(function (e) {
  var t = r;
  var n = t.lib;
  var o = n.WordArray;
  var i = n.Hasher;
  var s = t.algo;
  var a = [];
  var c = [];
  !(function () {
    function t(t) {
      for (n = e.sqrt(t), r = 2, undefined; r <= n; r++) {
        var n;
        var r;
        if (!(t % r)) return !1;
      }
      return !0;
    }
    function n(e) {
      return (4294967296 * (e - (0 | e))) | 0;
    }
    for (r = 2, o = 0, undefined; o < 64; ) {
      var r;
      var o;
      if (t(r)) {
        if (o < 8) {
          a[o] = n(e.pow(r, 0.5));
        }
        c[o] = n(e.pow(r, 1 / 3));
        o++;
      }
      r++;
    }
  })();
  var l = [];
  var u = (s.SHA256 = i.extend({
    _doReset: function () {
      this._hash = new o.init(a.slice(0));
    },
    _doProcessBlock: function (e, t) {
      for (
        n = this._hash.words,
          r = n[0],
          o = n[1],
          i = n[2],
          s = n[3],
          a = n[4],
          u = n[5],
          d = n[6],
          p = n[7],
          h = 0,
          undefined;
        h < 64;
        h++
      ) {
        var n;
        var r;
        var o;
        var i;
        var s;
        var a;
        var u;
        var d;
        var p;
        var h;
        if (h < 16) l[h] = 0 | e[t + h];
        else {
          var f = l[h - 15];
          var m =
            ((f << 25) | (f >>> 7)) ^ ((f << 14) | (f >>> 18)) ^ (f >>> 3);
          var g = l[h - 2];
          var _ =
            ((g << 15) | (g >>> 17)) ^ ((g << 13) | (g >>> 19)) ^ (g >>> 10);
          l[h] = m + l[h - 7] + _ + l[h - 16];
        }
        var y = (r & o) ^ (r & i) ^ (o & i);
        var v =
          ((r << 30) | (r >>> 2)) ^
          ((r << 19) | (r >>> 13)) ^
          ((r << 10) | (r >>> 22));
        var b =
          p +
          (((a << 26) | (a >>> 6)) ^
            ((a << 21) | (a >>> 11)) ^
            ((a << 7) | (a >>> 25))) +
          ((a & u) ^ (~a & d)) +
          c[h] +
          l[h];
        p = d;
        d = u;
        u = a;
        a = (s + b) | 0;
        s = i;
        i = o;
        o = r;
        r = (b + (v + y)) | 0;
      }
      n[0] = (n[0] + r) | 0;
      n[1] = (n[1] + o) | 0;
      n[2] = (n[2] + i) | 0;
      n[3] = (n[3] + s) | 0;
      n[4] = (n[4] + a) | 0;
      n[5] = (n[5] + u) | 0;
      n[6] = (n[6] + d) | 0;
      n[7] = (n[7] + p) | 0;
    },
    _doFinalize: function () {
      var t = this._data;
      var n = t.words;
      var r = 8 * this._nDataBytes;
      var o = 8 * t.sigBytes;
      n[o >>> 5] |= 128 << (24 - (o % 32));
      n[14 + (((o + 64) >>> 9) << 4)] = e.floor(r / 4294967296);
      n[15 + (((o + 64) >>> 9) << 4)] = r;
      t.sigBytes = 4 * n.length;
      this._process();
      return this._hash;
    },
    clone: function () {
      var e = i.clone.call(this);
      e._hash = this._hash.clone();
      return e;
    },
  }));
  t.SHA256 = i._createHelper(u);
  t.HmacSHA256 = i._createHmacHelper(u);
})(Math);
module.exports = r.SHA256;