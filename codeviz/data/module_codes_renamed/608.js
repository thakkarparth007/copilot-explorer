Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_copilot_utils_maybe = require("copilot-utils");
function getSamplingHashCode(e) {
  var t = 2147483647;
  var n = 5381;
  if (!e) return 0;
  for (; e.length < 8; ) e += e;
  for (var r = 0; r < e.length; r++)
    n = ((((n << 5) + n) | 0) + e.charCodeAt(r)) | 0;
  return ((n = n <= -2147483648 ? t : Math.abs(n)) / t) * 100;
}
exports.samplingTelemetryProcessor = function (e, t) {
  var n = e.sampleRate;
  return (
    null == n ||
    n >= 100 ||
    !(
      !e.data ||
      M_copilot_utils_maybe.TelemetryType.Metric !==
        M_copilot_utils_maybe.baseTypeToTelemetryType(e.data.baseType)
    ) ||
    (t.correlationContext && t.correlationContext.operation
      ? getSamplingHashCode(t.correlationContext.operation.id) < n
      : 100 * Math.random() < n)
  );
};
exports.getSamplingHashCode = getSamplingHashCode;
