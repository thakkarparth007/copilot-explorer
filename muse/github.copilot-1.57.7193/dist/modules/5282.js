var t = function () {
  function e() {}
  e.info = function (t) {
    for (var n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
    e.enableDebug && console.info(e.TAG + t, n);
  };
  e.warn = function (t) {
    for (var n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
    e.disableWarnings || console.warn(e.TAG + t, n);
  };
  e.enableDebug = !1;
  e.disableWarnings = !1;
  e.disableErrors = !1;
  e.TAG = "ApplicationInsights:";
  return e;
}();
module.exports = t;