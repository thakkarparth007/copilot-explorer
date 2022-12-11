var r;
var o;
var i;
var s;
var a;
var c;
var l;
var M_random_stuff_maybe;
M_random_stuff_maybe = require("random-stuff");
require("sha1");
require("hmac");
i = (o = (r = M_random_stuff_maybe).lib).Base;
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
      r = this.cfg,
        o = r.hasher.create(),
        i = s.create(),
        a = i.words,
        c = r.keySize,
        l = r.iterations,
        undefined;
      a.length < c;

    ) {
      var n;
      var r;
      var o;
      var i;
      var a;
      var c;
      var l;
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
module.exports = M_random_stuff_maybe.EvpKDF;
