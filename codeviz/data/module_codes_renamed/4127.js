Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_performance_monitor_NOTSURE = require("performance-monitor"),
  M_copilot_utils_NOTSURE = require("copilot-utils");
exports.performanceMetricsTelemetryProcessor = function (e, t) {
  switch ((t && t.addDocument(e), e.data.baseType)) {
    case M_copilot_utils_NOTSURE.TelemetryTypeString.Exception:
      M_performance_monitor_NOTSURE.countException();
      break;
    case M_copilot_utils_NOTSURE.TelemetryTypeString.Request:
      var n = e.data.baseData;
      M_performance_monitor_NOTSURE.countRequest(n.duration, n.success);
      break;
    case M_copilot_utils_NOTSURE.TelemetryTypeString.Dependency:
      var i = e.data.baseData;
      M_performance_monitor_NOTSURE.countDependency(i.duration, i.success);
  }
  return !0;
};
