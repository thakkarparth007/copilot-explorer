var r, o, i, s, a, c, l, u, d;
module.exports = (d = require(8249), require(2783), require(9824), i = (o = (r = d).lib).Base, s = o.WordArray, c = (a = r.algo).SHA1, l = a.HMAC, u = a.PBKDF2 = i.extend({
  cfg: i.extend({
    keySize: 4,
    hasher: c,
    iterations: 1
  }),
  init: function (e) {
    this.cfg = this.cfg.extend(e);
  },
  compute: function (e, t) {
    for (var n = this.cfg, r = l.create(n.hasher, e), o = s.create(), i = s.create([1]), a = o.words, c = i.words, u = n.keySize, d = n.iterations; a.length < u;) {
      var p = r.update(t).finalize(i);
      r.reset();
      for (var h = p.words, f = h.length, m = p, g = 1; g < d; g++) {
        m = r.finalize(m);
        r.reset();
        for (var _ = m.words, y = 0; y < f; y++) h[y] ^= _[y];
      }
      o.concat(p);
      c[0]++;
    }
    o.sigBytes = 4 * u;
    return o;
  }
}), r.PBKDF2 = function (e, t, n) {
  return u.create(n).compute(e, t);
}, d.PBKDF2);