Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_performance_monitor_maybe = require("performance-monitor");
var M_copilot_utils_maybe = require("copilot-utils");
exports.performanceMetricsTelemetryProcessor = function (e, t) {
  switch ((t && t.addDocument(e), e.data.baseType)) {
    case M_copilot_utils_maybe.TelemetryTypeString.Exception:
      M_performance_monitor_maybe.countException();
      break;
    case M_copilot_utils_maybe.TelemetryTypeString.Request:
      var n = e.data.baseData;
      M_performance_monitor_maybe.countRequest(n.duration, n.success);
      break;
    case M_copilot_utils_maybe.TelemetryTypeString.Dependency:
      var i = e.data.baseData;
      M_performance_monitor_maybe.countDependency(i.duration, i.success);
  }
  return !0;
};
