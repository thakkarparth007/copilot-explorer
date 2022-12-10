Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_telemetry_common_NOTSURE = require("telemetry-common"),
  RemoteDependencyDataConstants = (function () {
    function e() {}
    e.TYPE_HTTP = "Http";
    e.TYPE_AI = "Http (tracked component)";
    return e;
  })();
exports.RemoteDependencyDataConstants = RemoteDependencyDataConstants;
exports.domainSupportsProperties = function (e) {
  return (
    "properties" in e ||
    e instanceof M_telemetry_common_NOTSURE.EventData ||
    e instanceof M_telemetry_common_NOTSURE.ExceptionData ||
    e instanceof M_telemetry_common_NOTSURE.MessageData ||
    e instanceof M_telemetry_common_NOTSURE.MetricData ||
    e instanceof M_telemetry_common_NOTSURE.PageViewData ||
    e instanceof M_telemetry_common_NOTSURE.RemoteDependencyData ||
    e instanceof M_telemetry_common_NOTSURE.RequestData
  );
};
