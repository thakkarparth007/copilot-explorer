var t = (function () {
  function e() {}
  e.info = function (t) {
    for (n = [], r = 1, undefined; r < arguments.length; r++) {
      var n;
      var r;
      n[r - 1] = arguments[r];
    }
    if (e.enableDebug) {
      console.info(e.TAG + t, n);
    }
  };
  e.warn = function (t) {
    for (n = [], r = 1, undefined; r < arguments.length; r++) {
      var n;
      var r;
      n[r - 1] = arguments[r];
    }
    if (e.disableWarnings) {
      console.warn(e.TAG + t, n);
    }
  };
  e.enableDebug = false;
  e.disableWarnings = false;
  e.disableErrors = false;
  e.TAG = "ApplicationInsights:";
  return e;
})();
module.exports = t;