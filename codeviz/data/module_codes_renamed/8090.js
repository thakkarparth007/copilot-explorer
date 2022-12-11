var M_http_util_maybe = require("http-util");
var M_app_id_lookup_maybe = require("app-id-lookup");
var i = (function () {
  function e(t, n) {
    this.traceFlag = e.DEFAULT_TRACE_FLAG;
    this.version = e.DEFAULT_VERSION;
    if (t && "string" == typeof t) {
      if (t.split(",").length > 1)
        (this.traceId = M_http_util_maybe.w3cTraceId()),
          (this.spanId = M_http_util_maybe.w3cTraceId().substr(0, 16));
      else {
        var i = t.trim().split("-"),
          s = i.length;
        s >= 4
          ? ((this.version = i[0]),
            (this.traceId = i[1]),
            (this.spanId = i[2]),
            (this.traceFlag = i[3]))
          : ((this.traceId = M_http_util_maybe.w3cTraceId()),
            (this.spanId = M_http_util_maybe.w3cTraceId().substr(0, 16))),
          this.version.match(/^[0-9a-f]{2}$/g) ||
            ((this.version = e.DEFAULT_VERSION),
            (this.traceId = M_http_util_maybe.w3cTraceId())),
          "00" === this.version &&
            4 !== s &&
            ((this.traceId = M_http_util_maybe.w3cTraceId()),
            (this.spanId = M_http_util_maybe.w3cTraceId().substr(0, 16))),
          "ff" === this.version &&
            ((this.version = e.DEFAULT_VERSION),
            (this.traceId = M_http_util_maybe.w3cTraceId()),
            (this.spanId = M_http_util_maybe.w3cTraceId().substr(0, 16))),
          this.version.match(/^0[0-9a-f]$/g) ||
            (this.version = e.DEFAULT_VERSION),
          this.traceFlag.match(/^[0-9a-f]{2}$/g) ||
            ((this.traceFlag = e.DEFAULT_TRACE_FLAG),
            (this.traceId = M_http_util_maybe.w3cTraceId())),
          e.isValidTraceId(this.traceId) ||
            (this.traceId = M_http_util_maybe.w3cTraceId()),
          e.isValidSpanId(this.spanId) ||
            ((this.spanId = M_http_util_maybe.w3cTraceId().substr(0, 16)),
            (this.traceId = M_http_util_maybe.w3cTraceId())),
          (this.parentId = this.getBackCompatRequestId());
      }
    } else if (n) {
      this.parentId = n.slice();
      var a = M_app_id_lookup_maybe.getRootId(n);
      e.isValidTraceId(a) ||
        ((this.legacyRootId = a), (a = M_http_util_maybe.w3cTraceId())),
        -1 !== n.indexOf("|") &&
          (n = n.substring(
            1 + n.substring(0, n.length - 1).lastIndexOf("."),
            n.length - 1
          )),
        (this.traceId = a),
        (this.spanId = n);
    } else
      (this.traceId = M_http_util_maybe.w3cTraceId()),
        (this.spanId = M_http_util_maybe.w3cTraceId().substr(0, 16));
  }
  e.isValidTraceId = function (e) {
    return (
      e.match(/^[0-9a-f]{32}$/) && "00000000000000000000000000000000" !== e
    );
  };
  e.isValidSpanId = function (e) {
    return e.match(/^[0-9a-f]{16}$/) && "0000000000000000" !== e;
  };
  e.prototype.getBackCompatRequestId = function () {
    return "|" + this.traceId + "." + this.spanId + ".";
  };
  e.prototype.toString = function () {
    return (
      this.version +
      "-" +
      this.traceId +
      "-" +
      this.spanId +
      "-" +
      this.traceFlag
    );
  };
  e.prototype.updateSpanId = function () {
    this.spanId = M_http_util_maybe.w3cTraceId().substr(0, 16);
  };
  e.DEFAULT_TRACE_FLAG = "01";
  e.DEFAULT_VERSION = "00";
  return e;
})();
module.exports = i;
