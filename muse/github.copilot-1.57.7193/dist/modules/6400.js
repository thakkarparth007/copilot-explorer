var r = require(7923);
exports.encode = function (e) {
  var t,
    n = "",
    o = function (e) {
      return e < 0 ? 1 + (-e << 1) : 0 + (e << 1);
    }(e);
  do {
    t = 31 & o;
    (o >>>= 5) > 0 && (t |= 32);
    n += r.encode(t);
  } while (o > 0);
  return n;
};
exports.decode = function (e, t, n) {
  var o,
    i,
    s,
    a,
    c = e.length,
    l = 0,
    u = 0;
  do {
    if (t >= c) throw new Error("Expected more digits in base 64 VLQ value.");
    if (-1 === (i = r.decode(e.charCodeAt(t++)))) throw new Error("Invalid base64 digit: " + e.charAt(t - 1));
    o = !!(32 & i);
    l += (i &= 31) << u;
    u += 5;
  } while (o);
  n.value = (a = (s = l) >> 1, 1 == (1 & s) ? -a : a);
  n.rest = t;
};