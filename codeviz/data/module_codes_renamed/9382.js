Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_telemetry_common_maybe = require("telemetry-common");
var RemoteDependencyDataConstants = (function () {
  function e() {}
  e.TYPE_HTTP = "Http";
  e.TYPE_AI = "Http (tracked component)";
  return e;
})();
exports.RemoteDependencyDataConstants = RemoteDependencyDataConstants;
exports.domainSupportsProperties = function (e) {
  return (
    "properties" in e ||
    e instanceof M_telemetry_common_maybe.EventData ||
    e instanceof M_telemetry_common_maybe.ExceptionData ||
    e instanceof M_telemetry_common_maybe.MessageData ||
    e instanceof M_telemetry_common_maybe.MetricData ||
    e instanceof M_telemetry_common_maybe.PageViewData ||
    e instanceof M_telemetry_common_maybe.RemoteDependencyData ||
    e instanceof M_telemetry_common_maybe.RequestData
  );
};
