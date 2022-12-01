var r, o, i, s, a, c, l, u;
u = require(8249);
require(2783);
require(9824);
i = (o = (r = u).lib).Base;
s = o.WordArray;
c = (a = r.algo).MD5;
l = a.EvpKDF = i.extend({
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
      var n,
        r = this.cfg,
        o = r.hasher.create(),
        i = s.create(),
        a = i.words,
        c = r.keySize,
        l = r.iterations;
      a.length < c;

    ) {
      if (n) {
        o.update(n);
      }
      n = o.update(e).finalize(t);
      o.reset();
      for (var u = 1; u < l; u++) {
        n = o.finalize(n);
        o.reset();
      }
      i.concat(n);
    }
    i.sigBytes = 4 * c;
    return i;
  },
});
r.EvpKDF = function (e, t, n) {
  return l.create(n).compute(e, t);
};
module.exports = u.EvpKDF;