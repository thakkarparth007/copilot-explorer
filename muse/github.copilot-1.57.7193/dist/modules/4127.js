Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var r = require(4350),
  o = require(5290);
exports.performanceMetricsTelemetryProcessor = function (e, t) {
  switch ((t && t.addDocument(e), e.data.baseType)) {
    case o.TelemetryTypeString.Exception:
      r.countException();
      break;
    case o.TelemetryTypeString.Request:
      var n = e.data.baseData;
      r.countRequest(n.duration, n.success);
      break;
    case o.TelemetryTypeString.Dependency:
      var i = e.data.baseData;
      r.countDependency(i.duration, i.success);
  }
  return !0;
};