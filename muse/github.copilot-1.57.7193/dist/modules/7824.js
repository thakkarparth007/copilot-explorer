var t = 1e3,
  n = 60 * t,
  r = 60 * n,
  o = 24 * r;
function i(e, t, n, r) {
  var o = t >= 1.5 * n;
  return Math.round(e / n) + " " + r + (o ? "s" : "");
}
module.exports = function (e, s) {
  s = s || {};
  var a,
    c,
    l = typeof e;
  if ("string" === l && e.length > 0) return function (e) {
    if (!((e = String(e)).length > 100)) {
      var i = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
      if (i) {
        var s = parseFloat(i[1]);
        switch ((i[2] || "ms").toLowerCase()) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return 315576e5 * s;
          case "weeks":
          case "week":
          case "w":
            return 6048e5 * s;
          case "days":
          case "day":
          case "d":
            return s * o;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return s * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return s * n;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return s * t;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return s;
          default:
            return;
        }
      }
    }
  }(e);
  if ("number" === l && isFinite(e)) return s.long ? (a = e, (c = Math.abs(a)) >= o ? i(a, c, o, "day") : c >= r ? i(a, c, r, "hour") : c >= n ? i(a, c, n, "minute") : c >= t ? i(a, c, t, "second") : a + " ms") : function (e) {
    var i = Math.abs(e);
    return i >= o ? Math.round(e / o) + "d" : i >= r ? Math.round(e / r) + "h" : i >= n ? Math.round(e / n) + "m" : i >= t ? Math.round(e / t) + "s" : e + "ms";
  }(e);
  throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
};