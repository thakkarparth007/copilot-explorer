var r, o, i, s, a, c;
r = require(8249);
i = (o = r).lib;
s = i.Base;
a = i.WordArray;
(c = o.x64 = {}).Word = s.extend({
  init: function (e, t) {
    this.high = e;
    this.low = t;
  }
});
c.WordArray = s.extend({
  init: function (e, t) {
    e = this.words = e || [];
    this.sigBytes = null != t ? t : 8 * e.length;
  },
  toX32: function () {
    for (var e = this.words, t = e.length, n = [], r = 0; r < t; r++) {
      var o = e[r];
      n.push(o.high);
      n.push(o.low);
    }
    return a.create(n, this.sigBytes);
  },
  clone: function () {
    for (var e = s.clone.call(this), t = e.words = this.words.slice(0), n = t.length, r = 0; r < n; r++) t[r] = t[r].clone();
    return e;
  }
});
module.exports = r;