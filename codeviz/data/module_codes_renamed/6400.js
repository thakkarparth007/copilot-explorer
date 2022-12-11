var M_base64_encoding_utils_maybe = require("base64-encoding-utils");
exports.encode = function (e) {
  var t;
  var n = "";
  var o = (function (e) {
    return e < 0 ? 1 + (-e << 1) : 0 + (e << 1);
  })(e);
  do {
    t = 31 & o;
    if ((o >>>= 5) > 0) {
      t |= 32;
    }
    n += M_base64_encoding_utils_maybe.encode(t);
  } while (o > 0);
  return n;
};
exports.decode = function (e, t, n) {
  var o;
  var i;
  var s;
  var a;
  var c = e.length;
  var l = 0;
  var u = 0;
  do {
    if (t >= c) throw new Error("Expected more digits in base 64 VLQ value.");
    if (-1 === (i = M_base64_encoding_utils_maybe.decode(e.charCodeAt(t++))))
      throw new Error("Invalid base64 digit: " + e.charAt(t - 1));
    o = !!(32 & i);
    l += (i &= 31) << u;
    u += 5;
  } while (o);
  a = (s = l) >> 1;
  n.value = 1 == (1 & s) ? -a : a;
  n.rest = t;
};
