var t = (function () {
  function e() {}
  e.prototype.getUrl = function () {
    return this.url;
  };
  e.prototype.RequestParser = function () {
    this.startTime = +new Date();
  };
  e.prototype._setStatus = function (e, t) {
    var n = +new Date();
    this.duration = n - this.startTime;
    this.statusCode = e;
    var r = this.properties || {};
    if (t)
      if ("string" == typeof t) r.error = t;
      else if (t instanceof Error) r.error = t.message;
      else if ("object" == typeof t)
        for (var o in t) r[o] = t[o] && t[o].toString && t[o].toString();
    this.properties = r;
  };
  e.prototype._isSuccess = function () {
    return 0 < this.statusCode && this.statusCode < 400;
  };
  return e;
})();
module.exports = t;
