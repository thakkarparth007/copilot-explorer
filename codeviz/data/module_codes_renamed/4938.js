var M_random_stuff_maybe;
var o;
var i;
var s;
var a;
var c;
M_random_stuff_maybe = require("random-stuff");
i = (o = M_random_stuff_maybe).lib;
s = i.Base;
a = i.WordArray;
(c = o.x64 = {}).Word = s.extend({
  init: function (e, t) {
    this.high = e;
    this.low = t;
  },
});
c.WordArray = s.extend({
  init: function (e, t) {
    e = this.words = e || [];
    this.sigBytes = null != t ? t : 8 * e.length;
  },
  toX32: function () {
    for (e = this.words, t = e.length, n = [], r = 0, undefined; r < t; r++) {
      var e;
      var t;
      var n;
      var r;
      var o = e[r];
      n.push(o.high);
      n.push(o.low);
    }
    return a.create(n, this.sigBytes);
  },
  clone: function () {
    for (
      e = s.clone.call(this),
        t = e.words = this.words.slice(0),
        n = t.length,
        r = 0,
        undefined;
      r < n;
      r++
    ) {
      var e;
      var t;
      var n;
      var r;
      t[r] = t[r].clone();
    }
    return e;
  },
});
module.exports = M_random_stuff_maybe;
