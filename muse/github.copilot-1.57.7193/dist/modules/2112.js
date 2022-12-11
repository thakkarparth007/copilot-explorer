var r;
var o;
var i;
var s;
var a;
var c;
var l;
var u;
var d;
d = require(8249);
require(2783);
require(9824);
i = (o = (r = d).lib).Base;
s = o.WordArray;
c = (a = r.algo).SHA1;
l = a.HMAC;
u = a.PBKDF2 = i.extend({
  cfg: i.extend({
    keySize: 4,
    hasher: c,
    iterations: 1,
  }),
  init: function (e) {
    this.cfg = this.cfg.extend(e);
  },
  compute: function (e, t) {
    for (
      n = this.cfg,
        r = l.create(n.hasher, e),
        o = s.create(),
        i = s.create([1]),
        a = o.words,
        c = i.words,
        u = n.keySize,
        d = n.iterations,
        undefined;
      a.length < u;

    ) {
      var n;
      var r;
      var o;
      var i;
      var a;
      var c;
      var u;
      var d;
      var p = r.update(t).finalize(i);
      r.reset();
      for (h = p.words, f = h.length, m = p, g = 1, undefined; g < d; g++) {
        var h;
        var f;
        var m;
        var g;
        m = r.finalize(m);
        r.reset();
        for (_ = m.words, y = 0, undefined; y < f; y++) {
          var _;
          var y;
          h[y] ^= _[y];
        }
      }
      o.concat(p);
      c[0]++;
    }
    o.sigBytes = 4 * u;
    return o;
  },
});
r.PBKDF2 = function (e, t, n) {
  return u.create(n).compute(e, t);
};
module.exports = d.PBKDF2;